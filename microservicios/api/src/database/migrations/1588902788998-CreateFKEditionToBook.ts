import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFKEditionToBook1588902788998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE edition
            ADD CONSTRAINT FK_d586f256b83c9cd779fdc73f3b7 
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE NO ACTION ON UPDATE NO ACTION);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        ALTER TABLE edition
            DROP FOREIGN KEY FK_d586f256b83c9cd779fdc73f3b7;`
        );
    }

}
