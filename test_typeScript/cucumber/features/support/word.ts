import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page; 

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);