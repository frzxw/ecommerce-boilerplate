import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Request() req: { user: { userId: string } },
    @Body() createOrderDto: Prisma.OrderCreateInput,
  ) {
    // In a real app, we'd probably build the order from the cart or specific DTO
    // For now, we assume the DTO is passed correctly, but we should override userId from token
    return this.ordersService.create({
      ...createOrderDto,
      user: { connect: { id: req.user.userId } },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: { user: { userId: string; role: string } }) {
    // Users see their own orders, admins see all (logic to be added in service or here)
    if (req.user.role === 'ADMIN') {
      return this.ordersService.findAll();
    }
    return this.ordersService.findAllByUser(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: Prisma.OrderUpdateInput,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
