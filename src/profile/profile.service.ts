import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class ProfileService {
	constructor(private prisma: PrismaService) {}

	async changePassword(password: string, req){
		try{
			const user = await this.prisma.admin.findUnique({
				where: {id: req.user.id}
			})
			if(!user)
				throw new NotFoundException('User not found')
			const passMatch = await bcrypt.compare(password, user.password)
			if(passMatch)
				throw new ConflictException('Passwords cannot be same')
			const hash = await bcrypt.hash(password, 10)
			const newPassUser = await this.prisma.admin.update({
				where: {id: req.user.id},
				data: {
					password: hash
				}
			})
			return {message: 'Password has been updated'}
		}
		catch(err){
			if(err instanceof ConflictException || err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('Something walk wrong')
		}
	}
}
