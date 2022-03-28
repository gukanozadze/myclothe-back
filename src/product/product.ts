import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from '../order/order';
import { User } from '../user/user';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: 'https://i.imgur.com/Sg431sW.jpg' })
    image: string;

    @Column()
    price: number;

    @Column()
    color: string;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    rating: number;

    @Column({ default: 0 })
    rating_count: number;

    @Column('simple-array', { nullable: true })
    ratings: number[];

    @Column({ nullable: true })
    user_id: number;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
