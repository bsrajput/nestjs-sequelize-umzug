import { Controller, Get, Redirect } from "@nestjs/common";
import { Public } from "@trejgun/nest-js-providers";

@Controller("/")
export class AppController {
  @Public()
  @Get("/")
  @Redirect("/swagger", 301)
  public redirect(): void {}
}
