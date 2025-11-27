import { Controller, UseGuards, ParseIntPipe, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import {ShopsOwnersService} from './shops-owners.service';
import {JwtAuthGuard} from '../auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shops-owners')
export class ShopsOwnersController {
	constructor(private shopsOwnersService: ShopsOwnersService) {}

	@Get()
	getAll(){
		return this.shopsOwnersService.getShopsOwners()
	}

	@Get(':id')
	getOne(@Param('id', ParseIntPipe) id: number){
		return this.shopsOwnersService.getShopOwner(id)
	}

	@Post()
	createOne(@Body('name') name:string, @Body('mail') mail: string, @Body('phone') phone: string, @Body('address') address: string){
		return this.shopsOwnersService.createShopOwner(name, mail, phone, address)
	}

	@Patch(':id')
	updateOne(@Param('id', ParseIntPipe) id: number, @Body('field') field: string, @Body('value') value: any){
		return this.shopsOwnersService.updateShopOwner(id, field, value)
	}

	@Delete(':id')
	deleteOne(@Param('id', ParseIntPipe) id: number){
		return this.shopsOwnersService.deleteShopOwner(id)
	}
}
