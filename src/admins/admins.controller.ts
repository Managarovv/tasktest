import { Controller, UseGuards, Get, Post, Patch, Delete, Body, Param, Req, ParseIntPipe  } from '@nestjs/common';
import {AdminsService} from './admins.service'
import {JwtAuthGuard} from '../auth/jwt/jwt-auth.guard'
import {RolesGuard} from '../auth/jwt/roles.guard'
import {Roles} from '../auth/jwt/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admins')
export class AdminsController {
	constructor(private adminsService: AdminsService) {}

	@Roles('MANAGER', 'ROOT')
	@Get()
	getAll(){
		return this.adminsService.findAll()
	}

	@Roles('ROOT')
	@Post()
	createAdmin(@Body('name') name: string, @Body('mail') mail: string, @Body('password') password: string){
		return this.adminsService.createOne(name, mail, password)
	}

	@Roles('ROOT')
	@Patch(':id/password')
	updatePass(@Param('id', ParseIntPipe) id: number, @Body('password') password: string){
		return this.adminsService.updateOne(id, password)
	}

	@Roles('ROOT')
	@Delete(':id')
	deleteAdmin(@Param('id', ParseIntPipe) id:number){
		return this.adminsService.deleteOne(id)
	}
}
