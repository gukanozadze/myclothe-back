import { Exclude, Expose } from 'class-transformer';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from '../product/product';
import { User } from '../user/user';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    completed: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    created_at: Date;

    @Column()
    user_id: number;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    product_id: number;

    @ManyToOne(() => Product, (product) => product.orders)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
