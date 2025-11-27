import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileController } from './profile/profile.controller';
import { RequestsController } from './requests/requests.controller';
import { TerminalsController } from './terminals/terminals.controller';
import { ShopsController } from './shops/shops.controller';
import { ShopsOwnersController } from './shops-owners/shops-owners.controller';
import { AdminsController } from './admins/admins.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminsService } from './admins/admins.service';
import { ShopsOwnersService } from './shops-owners/shops-owners.service';
import { ShopsService } from './shops/shops.service';
import { TerminalsService } from './terminals/terminals.service';
import { RequestsService } from './requests/requests.service';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AppController, ProfileController, RequestsController, TerminalsController, ShopsController, ShopsOwnersController, AdminsController, AuthController],
  providers: [AppService, AuthService, PrismaService, AdminsService, ShopsOwnersService, ShopsService, TerminalsService, RequestsService, ProfileService],
})
export class AppModule {}
