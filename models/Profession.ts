import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';



@Table({ timestamps: true, tableName: 'profession' })
export class Profession extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	title!: string;


	@Default("")
	@AllowNull(false)
	@Column(DataType.STRING)
	image!: string


	@ForeignKey(() => Sector)
	@AllowNull(false)
	@Column(DataType.INTEGER)
    sectorId!: number;
	


	@BelongsTo(() => Sector, { onDelete: 'CASCADE' })
	sector!: Sector;
}
