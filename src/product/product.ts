import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { Order } from '../order/order';
import { User } from '../user/user';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    // Created By
    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Order, (order) => order.user)
    orders: Order[];

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    stock: number;

    @Column({
        default: 'https://cf.shopee.ph/file/de6128223b8d2b854a1567ed335f2204',
    })
    image: string;

    @Column()
    price: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    rating: number;

    @Column({ default: 0 })
    rating_count: number;

    @Column('simple-array', { nullable: true })
    ratings: number[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_at: Date;
}
