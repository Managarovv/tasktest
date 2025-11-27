import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import {Shops} from './interfaces/shops.interfaces'
import * as bcrypt from 'bcrypt'

@Injectable()
export class ShopsService {
	constructor(private prisma: PrismaService) {}

	async findAll(){
		const shops = await this.prisma.store.findMany({})
		if (!shops)
			throw new InternalServerErrorException('InternalServerError')
		else{
			var shopsList: Shops[] = shops.map(current => ({
				id: current.id,
				credentials: current.name,
				address: current.address,
				ownerid: current.ownerId
			}))
			return shopsList
		}
	}

	async findShop(id: number){
		try{
			const shop = await this.prisma.store.findUnique({
				where: {id: id}
			})
			if(!shop)
				throw new NotFoundException('Shop not found')
			return {
				id: shop.id,
				credentials: shop.name,
				address: shop.address,
				owner: shop.ownerId
			}
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async createShop(credentials: string, address: string, login: string, password: string, ownerid: number){
		try{
			const existShop = await this.prisma.store.findFirst({
				where: { name: credentials}
			})
			if(existShop)
				throw new ConflictException('that Shop already exist')

			const shopOwner = await this.prisma.owner.findUnique({
				where: {id: ownerid}
			})
			if(!shopOwner)
				throw new NotFoundException('ShopOwner not found')

			const hash = await bcrypt.hash(password, 10)
			const newShop = await this.prisma.store.create({
				data: {
					name: credentials,
					address: address,
					login: login,
					password: hash,
					ownerId: ownerid
				}
			})
			return {message: 'Shop has created'}
		}
		catch(err){
			console.log(err)
			if(err instanceof ConflictException || err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async updateShop(id: number, login: string, password: string){
		try{
			const existShop = await this.prisma.store.findUnique({
				where: {id: id}
			})
			if(!existShop)
				throw new NotFoundException('Owner or field not found')
			const passMatch = await bcrypt.compare(password, existShop.password)
			if(passMatch && login == existShop.login)
				throw new ConflictException('logins or passwords cannot match the old ones')

			const hash = await bcrypt.hash(password, 10)
			const newLPShop = await this.prisma.store.update({
				where: {id: id},
				data: {
					login: login,
					password: hash
				}
			})
			return {message: "data updated"}
		}
		catch(err){
			if(err instanceof NotFoundException || err instanceof ConflictException)
				throw err
			throw new InternalServerErrorException
		}
	}
}
