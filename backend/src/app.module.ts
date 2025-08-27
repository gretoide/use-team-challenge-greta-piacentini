import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { ColumnsModule } from './columns/columns.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CardsModule, ColumnsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
