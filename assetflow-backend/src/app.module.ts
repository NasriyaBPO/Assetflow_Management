import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { AssetsModule } from './assets/assets.module';
import { EmployeesModule } from './employees/employees.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ReturnsModule } from './returns/returns.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [PrismaModule, HealthModule, CategoriesModule, AssetsModule, EmployeesModule, AssignmentsModule, NotificationsModule, ReturnsModule, DashboardModule, AuthModule, UsersModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}