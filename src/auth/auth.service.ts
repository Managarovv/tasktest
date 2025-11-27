import { Injectable, UnauthorizedException, BadRequestException , InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor (private jwtService: JwtService, private prisma: PrismaService){}
	findAll(user: any){
		return `id: ${user.id} mail: ${user.mail}`
	}

	async signIn(mail: string, pass: string){

		const admin = await this.prisma.admin.findUnique({
			where: {email: mail},
		})

		if(!admin)
			throw new BadRequestException('incorrect data')

		const validpass = await bcrypt.compare(pass, admin.password)

		if (!validpass)
			throw new BadRequestException('incorrect password')

		const payload = {
			id: admin.id,
			mail: admin.email,
			role: admin.role
		}
		const access_token = await this.jwtService.signAsync(payload, {expiresIn: '1h'})
		const refresh_token =  await this.jwtService.signAsync(payload, { expiresIn:'15d'})
		const refresh_token_hash = await bcrypt.hash(refresh_token, 10)

		const newRefreshToken = await this.prisma.admin.update({
			where: {id: admin.id},
			data: {refreshtoken: refresh_token_hash}
		})
		if (!newRefreshToken)
			throw new InternalServerErrorException('An error occurred while saving data to the database.')

		return {
			access_token: access_token,
			refresh_token: refresh_token
		}
	}

	async out(oldRefToken: string){
		let payload;

		try {
    		payload = this.jwtService.verify(oldRefToken);
		} catch {
    		throw new BadRequestException('Bad token');
		}

		const newPayload = {
    		id: payload.id,
    		mail: payload.mail
		};


		const admin = await this.prisma.admin.findUnique({
			where: {id: newPayload.id}
		})

		if (!admin || admin.refreshtoken == null)
			throw new BadRequestException('incorrect data')

		const isValid = await bcrypt.compare(oldRefToken, admin.refreshtoken)
		if(!isValid)
			throw new UnauthorizedException('invalid token')

		const revtoken = await this.prisma.admin.update({
			where: {id: newPayload.id},
			data: {refreshtoken: null}
		})

		if(!revtoken)
			throw new BadRequestException('incorrect data')

		return { message: 'logged out successfully' }
	}

	async refreshedtoken(oldRefToken: string){
		try{
			const payload = this.jwtService.verify(oldRefToken)
			const newPayload = {
				id: payload.id,
				mail: payload.mail,
				role: payload.role
			}

			const admin = await this.prisma.admin.findUnique({
				where: {id: newPayload.id},
			})

			if(!admin || admin.refreshtoken == null)
				throw new BadRequestException('incorrect data')

			const reftokenMatch = await bcrypt.compare(oldRefToken, admin.refreshtoken)

			if (!reftokenMatch)
				throw new UnauthorizedException('incorrect token')

			const access_token = await this.jwtService.signAsync(newPayload, {expiresIn: '1h'})
			const refresh_token =  await this.jwtService.signAsync(newPayload, { expiresIn:'15d'})
			const refresh_token_hash = await bcrypt.hash(refresh_token, 10)
			
			const newRefreshToken = await this.prisma.admin.update({
				where: {id: admin.id},
				data: {refreshtoken: refresh_token_hash}
			})

		if (!newRefreshToken)
			throw new InternalServerErrorException('An error occurred while saving data to the database.')


			return {
				access_token: access_token,
				refresh_token: refresh_token
			}
		}
		catch(err){
			//return err
			throw new UnauthorizedException('invalid refresh token')
		}
	}
}
