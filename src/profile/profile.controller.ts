import { Controller, UseGuards, Patch, Body, Req } from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt/jwt-auth.guard'
import {ProfileService} from './profile.service'

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
	constructor(private profileService: ProfileService) {}

	@Patch('password')
	updatePass(@Body('password') password: string, @Req() req){
		return this.profileService.changePassword(password, req)
	}
}
