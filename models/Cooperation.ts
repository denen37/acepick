import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { Profession } from './Profession';
import { Sector } from './Sector';
import { Profile } from './Profile';




@Table({ timestamps: true, tableName: 'corperate' })
export class Corperate extends Model {
	
	@AllowNull(true)
	@Column(DataType.STRING)
	nameOfOrg!: string;



    @AllowNull(true)
	@Column(DataType.STRING)
	phone!: string;


    @AllowNull(true)
	@Column(DataType.STRING)
	address!: string;




    @AllowNull(true)
	@Column(DataType.STRING)
	state!: string;





    @AllowNull(true)
	@Column(DataType.STRING)
	lga!: string;



    @AllowNull(true)
	@Column(DataType.STRING)
	regNum!: string;



    @AllowNull(true)
	@Column(DataType.STRING)
	noOfEmployees!: number;

	


	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
    userId!: string;




	// @ForeignKey(() => Sector)
	// @AllowNull(false)
	// @Column(DataType.INTEGER)
    // sectorId!: number;




	// @AllowNull(false)
    // @ForeignKey(() => Profession)
	// @Column(DataType.INTEGER)
    // professionId!: number;




	@AllowNull(false)
    @ForeignKey(() => Profile)
	@Column(DataType.INTEGER)
    profileId!: number;


	@BelongsTo(() => Profile, { onDelete: 'CASCADE'})
	profile!: Profile;

	// @BelongsTo(() => Sector, { onDelete: 'CASCADE' })
	// sector!: Sector;


	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;
}
