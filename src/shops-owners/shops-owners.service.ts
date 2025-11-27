import { Injectable, InternalServerErrorException, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class ShopsOwnersService {
	constructor(private prisma: PrismaService) {}

	async getShopsOwners(){
		try{
			const shopsOwners = await this.prisma.owner.findMany({})
			return shopsOwners
		}
		catch(err){
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async getShopOwner(id: number){
		try{
			const shopOwner = await this.prisma.owner.findUnique({
				where: {id: id}
			})
			if(!shopOwner)
				throw new NotFoundException('ShopOwner not found')
			return shopOwner
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async createShopOwner(name: string, mail: string, phone: string, address: string){
		try{
			const existShopOwner = await this.prisma.owner.findFirst({
				where: {
					OR: [
						{name: name},
						{email: mail},
						{phone: phone}
					]
				}
			})
			if(existShopOwner)
				throw new ConflictException('that owner already exist')
			const newShopOwner = await this.prisma.owner.create({
				data: {
					name: name,
					email: mail,
					phone: phone,
					address: address
				}
			})
			return {message: 'owner has created'}
		}
		catch(err){
			if(err instanceof ConflictException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async updateShopOwner(id: number, field: string, value: any){
		try{
			const existshopOwner = await this.prisma.owner.findUnique({
				where: {id: id}
			})
			if(!existshopOwner || !(field in existshopOwner))
				throw new NotFoundException('Owner or field not found')

			const allowedFields = ['name', 'email', 'phone'];
				if (!allowedFields.includes(field)) 
					throw new BadRequestException('Field not allowed');

			const newValueShopOwner = await this.prisma.owner.update({
				where: {id: id},
				data: {
					[field]: value
				}
			})
			return {message: 'data updated'}
		}
		catch(err){
			if(err instanceof NotFoundException || err instanceof BadRequestException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async deleteShopOwner(id: number){
		try{
			const existshopOwner = await this.prisma.owner.findUnique({
				where: {id: id}
			})
			if(!existshopOwner)
				throw new NotFoundException('Owner not found')
			const deleteshopOwner = await this.prisma.owner.delete({
				where: {id: id}
			})
			return {message: `Owner: ${existshopOwner.name} has deleted`}
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}
}
