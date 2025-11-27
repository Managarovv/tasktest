import { Injectable, InternalServerErrorException, NotFoundException, ConflictException  } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import { TerminalStatus } from '@prisma/client';

@Injectable()
export class TerminalsService {
	constructor(private prisma: PrismaService) {}

	async findAll(){
		const terminals = await this.prisma.terminal.findMany({})
		if (!terminals)
			throw new InternalServerErrorException('InternalServerError')
		return terminals
	}

	async findOne(id: number){
		try{
			const terminal = await this.prisma.terminal.findUnique({
				where: {id: id}
			})
			if(!terminal)
				throw new NotFoundException('Terminal not found')
			return terminal
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async updateStatus(id: number, status: boolean){
		try{
			const terminal = await this.prisma.terminal.findUnique({
				where: {id: id}
			})
			if(!terminal)
				throw new NotFoundException('Terminal not found')
			const statusTerminal = status? TerminalStatus.ACTIVE : TerminalStatus.INACTIVE
			const aliveTerminal = await this.prisma.terminal.update({
				where: {id: id},
				data: {status: statusTerminal}
			})
			return terminal
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}

	async aliveStatus(id: number){
		try{
			const terminal = await this.prisma.terminal.findUnique({
				where: {id: id}
			})
			if(!terminal)
				throw new NotFoundException('Terminal not found')
			const aliveTerminal = await this.prisma.terminal.update({
				where: {id: id},
				data: {status: TerminalStatus.ACTIVE}
			})
			return terminal
		}
		catch(err){
			if(err instanceof NotFoundException)
				throw err
			throw new InternalServerErrorException('something walk wrong')
		}
	}
}
