import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFKBookToAuthor1588902905707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("\
            ALTER TABLE book\
                ADD CONSTRAINT FK_66a4f0f47943a0d99c16ecf90b2\
                FOREIGN KEY (authorId) REFERENCES author(id) ON DELETE NO ACTION ON UPDATE NO ACTION;\
            "
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("\
            ALTER TABLE book\
                DROP FOREIGN KEY FK_66a4f0f47943a0d99c16ecf90b2;\
            ");
    }

}
