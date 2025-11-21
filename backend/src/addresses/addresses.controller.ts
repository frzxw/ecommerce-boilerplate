import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('addresses')
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() createAddressDto: Prisma.AddressCreateInput) {
        return this.addressesService.create(req.user.userId, createAddressDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Request() req: any) {
        return this.addressesService.findAll(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.addressesService.findOne(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateAddressDto: Prisma.AddressUpdateInput,
    ) {
        return this.addressesService.update(id, req.user.userId, updateAddressDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.addressesService.remove(id, req.user.userId);
    }
}
