import { Controller, UseGuards, Get, Post, Patch, Body, Param, ParseIntPipe  } from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt/jwt-auth.guard'
import {RequestsService} from './requests.service'

@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
	constructor(private requestsService: RequestsService){}

	@Get()
	getAll(){
		return this.requestsService.findAll()
	}

	@Patch(':id/approve')
	approve(@Param('id', ParseIntPipe) id: number, @Body('mac') mac: string, @Body('storeid', ParseIntPipe) storeid: number){
		return this.requestsService.approveRequest(id, mac, storeid)
	}

	@Patch(':id/reject')
	reject(@Param('id', ParseIntPipe) id: number){
		return this.requestsService.rejectRequest(id)
	}

	@Post(":id/comment")
	update(@Param('id', ParseIntPipe) id: number, @Body('comment') comment: string){
		return this.requestsService.addComment(id, comment)
	}
}
