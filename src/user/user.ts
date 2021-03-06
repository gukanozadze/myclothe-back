import { Exclude, Expose } from 'class-transformer';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Order } from '../order/order';
import { Product } from '../product/product';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    full_name: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ default: true })
    is_manager: boolean;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
