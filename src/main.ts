import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 // Configure CORS
 app.enableCors({
  origin: 'http://localhost:3000', // Replace with the URL of the frontend application
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true, // Enable cookies
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers
});
  await app.listen(5000);
}
bootstrap();
