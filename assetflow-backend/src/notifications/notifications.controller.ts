import {
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  findMine(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.findMine(req.user.id);
  }

  @Get('unread')
  findMyUnread(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.findMyUnread(req.user.id);
  }

  @Patch('read')
  markAllAsRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}