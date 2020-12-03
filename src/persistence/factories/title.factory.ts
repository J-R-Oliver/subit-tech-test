import { define } from "typeorm-seeding";
import Faker from "faker";
import TitleEntity from "../entities/TitleEntity";

define(TitleEntity, (faker: typeof Faker) => {
  const titleEntity = new TitleEntity();

  titleEntity.jobTitle = faker.name.jobTitle();

  return titleEntity;
});
