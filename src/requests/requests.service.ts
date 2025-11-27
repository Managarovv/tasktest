import { Injectable, InternalServerErrorException, NotFoundException, ConflictException   } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
	constructor(private prisma: PrismaService) {}

	async findAll(){
		const requests = await this.prisma.terminalRequest.findMany({})
		if (!requests)
			throw new InternalServerErrorException('InternalServerError')
		return requests
	}

	async rejectRequest(id: number){
		try{
			const request = await this.prisma.terminalRequest.findUnique({
				where: {id: id}
			})
			if(!request)
				throw new NotFoundException('Request not found')
			
			const requestStatusApprove = await this.prisma.terminalRequest.update({
				where: {id: id},
				data: {status: RequestStatus.REJECTED}
			})
			//сделать транзакцию создать терминал
			return {message: 'Request rejected'}
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async approveRequest(id: number, mac: string, storeid: number){
		try{
			const request = await this.prisma.terminalRequest.findUnique({
				where: {id: id}
			})
			if(!request)
				throw new NotFoundException('Request not found')

			const transaction = await this.prisma.$transaction(async()=>{
				const requestStatusApprove = await this.prisma.terminalRequest.update({
					where: {id: id},
					data: {status: RequestStatus.APPROVED}
				})
				const terminal = await this.prisma.terminal.create({
					data: {
						mac: mac,
						storeId: storeid
					}
				})
			})
			
			return {message: 'Request approved'}
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async addComment(id: number, comment: string){
		try{
			const request = await this.prisma.terminalRequest.findUnique({
				where: {id: id}
			})
			if(!request)
				throw new NotFoundException('Request not found')
			
			const requestStatusApprove = await this.prisma.terminalRequest.update({
				where: {id: id},
				data: {comment: comment}
			})
			return {message: 'Comment added'}
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}
}
