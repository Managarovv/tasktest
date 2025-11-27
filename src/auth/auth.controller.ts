import { Controller, UseGuards, Body, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service'
import {JwtAuthGuard} from './jwt/jwt-auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getAll(@Req() req){
		return this.authService.findAll(req.user)
	}

	@Post('login')
	signin(@Body() body: any){
		return this.authService.signIn(body.mail, body.pass)
	}

	@Post('logout')
	out(@Body() body: any){
		return this.authService.out(body.reftoken)
	}

	@Post('refresh')
	reftoken(@Body() body: any){
		return this.authService.refreshedtoken(body.reftoken)
	}
}
