import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableLog1588901055731 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("\
            CREATE TABLE log (\
                id int NOT NULL AUTO_INCREMENT,\
                operation varchar(255) NOT NULL,\
                operationType varchar(255) NOT NULL,\
                payload varchar(255) NULL,\
                unixStartTime BIGINT NOT NULL,\
                executionTime int NOT NULL,\
                resultPayload varchar(255) NULL,\
                PRIMARY KEY (id)\
            );\
        ");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DELETE TABLE log;");
    }

}
