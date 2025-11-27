import { IsString, IsNumber, IsInt } from 'class-validator';
import {Type} from 'class-transformer'

export class CreateShopDto{
	@IsString()
	credentials: string

	@IsString()
	address: string

	@IsString()
	login: string

	@IsString()
	password: string

	@Type(() => Number)
	@IsInt()
	ownerId: number
}