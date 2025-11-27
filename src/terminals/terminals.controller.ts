import { Controller, UseGuards, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt/jwt-auth.guard'
import {TerminalsService} from './terminals.service'

@UseGuards(JwtAuthGuard)
@Controller('terminals')
export class TerminalsController {
	constructor(private terminalsService: TerminalsService){}

	@Get()
	getAll(){
		return this.terminalsService.findAll()
	}

	@Get(':id')
	getOne(@Param('id', ParseIntPipe) id: number){
		return this.terminalsService.findOne(id)
	}

	@Patch(':id/status')
	updateOne(@Param('id', ParseIntPipe) id: number, @Body('status') status: boolean){
		return this.terminalsService.updateStatus(id, status)
	}

	@Post('alive')
	heartbeat(@Body('id', ParseIntPipe) id: number){
		return this.terminalsService.aliveStatus(id)
	}
}
