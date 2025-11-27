import { Injectable, InternalServerErrorException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import {Admins} from './interfaces/admins.interfaces'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminsService {
	constructor(private prisma: PrismaService) {}

	async findAll(){
		const admins = await this.prisma.admin.findMany({})
		if (!admins)
			throw new InternalServerErrorException('InternalServerError')
		else{
			var adminsList: Admins[] = admins.map(current => ({
				id: current.id,
				name: current.name,
				mail: current.email,
				role: current.role
			}))
			return adminsList
		}
	}
	async createOne(name: string, mail: string, password: string){
		try{
			const existMail = await this.prisma.admin.findUnique({
				where: {email: mail}
			})
			if (existMail)
				throw new ConflictException('mail alreedy exist')
		}
		catch(err){
			throw new BadRequestException('wrong data')
		}
		
		const hash = await bcrypt.hash(password, 10)
		const manager = await this.prisma.admin.create({
			data: {
				name: name,
      			email: mail,
      			password: hash,
      			role: "MANAGER",
			},
		})
		if (!manager)
			throw new InternalServerErrorException('something walk wrong')
		return {
			id: manager.id, 
			name: manager.name, 
			mail: manager.email,
			role: manager.role
		}

	}
	async updateOne(id: number, pass: string){
		try {
			const existPass = await this.prisma.admin.findUnique({
				where: {id: id}
			})
			if(!existPass)
				throw new NotFoundException('Admin don`t exist')
			const samePass = await bcrypt.compare(pass, existPass.password)
			if(samePass)
				throw new ConflictException('passwords can`t be same')
		}
		catch(err){
			if(err instanceof ConflictException || err instanceof NotFoundException)
				throw err
			throw new BadRequestException('wrong data')
		}
		const hash = await bcrypt.hash(pass, 10)
		const newPass = await this.prisma.admin.update({
			where: {id: id},
			data: {password: hash}
		})
		if(!newPass)
			throw new InternalServerErrorException('something walk wrong')
		return { message: 'password was changed'}
	}
	async deleteOne(id: number){
		try{
			const existAdmin = await this.prisma.admin.findUnique({
				where: {id: id}
			})
			if(!existAdmin)
				throw new NotFoundException('Admin not found')
			const deleteAdmin = await this.prisma.admin.delete({
				where: {id: id}
			})
			return {message: `Admin: ${existAdmin.name} has deleted`}
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}
}
