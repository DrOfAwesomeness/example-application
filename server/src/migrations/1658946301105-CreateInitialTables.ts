import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1658946301105 implements MigrationInterface {
    name = 'CreateInitialTables1658946301105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`emailAddress\` varchar(255) NOT NULL, \`fullName\` text NOT NULL, \`stripeCustomerId\` varchar(255) COLLATE "utf8_bin" NOT NULL, UNIQUE INDEX \`IDX_83f24bc49f83dce1c7a48ff7a9\` (\`emailAddress\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`stripeProductId\` varchar(255) COLLATE "utf8_bin" NULL, \`price\` int NOT NULL, \`sortIndex\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_line_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` int NOT NULL, \`productId\` int NULL, \`text\` varchar(255) NOT NULL, \`price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`customerId\` int NOT NULL, \`status\` enum ('unpaid', 'completed', 'cancelled') NOT NULL DEFAULT 'unpaid', \`totalPrice\` int NOT NULL, \`paymentUrl\` varchar(500) NULL, \`stripeCheckoutSessionId\` varchar(255) COLLATE "utf8_bin" NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_line_item\` ADD CONSTRAINT \`FK_a99e41141120b3f54c2e72ac474\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_line_item\` ADD CONSTRAINT \`FK_dc5a46e6d844c5fd6f55354bdba\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_124456e637cca7a415897dce659\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_124456e637cca7a415897dce659\``);
        await queryRunner.query(`ALTER TABLE \`order_line_item\` DROP FOREIGN KEY \`FK_dc5a46e6d844c5fd6f55354bdba\``);
        await queryRunner.query(`ALTER TABLE \`order_line_item\` DROP FOREIGN KEY \`FK_a99e41141120b3f54c2e72ac474\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`order_line_item\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_83f24bc49f83dce1c7a48ff7a9\` ON \`customer\``);
        await queryRunner.query(`DROP TABLE \`customer\``);
    }

}
