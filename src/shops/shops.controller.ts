import { Controller, UseGuards, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import {ShopsService} from './shops.service'
import {CreateShopDto} from './dto/create-shop.dto'
import {JwtAuthGuard} from '../auth/jwt/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('shops')
export class ShopsController {
	constructor(private shopsService: ShopsService) {}

	@Get()
	getAll(){
		return this.shopsService.findAll()
	}

	@Get(':id')
	getOne(@Param('id', ParseIntPipe) id: number){
		return this.shopsService.findShop(id)
	}

	@Post()
	createOne(@Body() body: CreateShopDto){
		return this.shopsService.createShop(body.credentials, body.address, body.login, body.password, body.ownerId)
	}

	@Patch(':id/credentials')
	updateOne(@Param('id', ParseIntPipe) id: number, @Body('login') login: string, @Body('password') password: string){
		return this.shopsService.updateShop(id, login, password)
	}
}
