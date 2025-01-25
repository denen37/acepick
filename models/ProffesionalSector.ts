import { Table, Model, Column, DataType, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { Profession } from './Profession';
import { Sector } from './Sector';
import { Profile } from './Profile';



// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
export enum WorkType {
	BUSY = 'BUSY',
	IDLE = 'IDLE',
}

@Table({ timestamps: true, tableName: 'professional_sector' })
export class ProfessionalSector extends Model {

	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;


	@AllowNull(true)
	@Column(DataType.DECIMAL)
	chargeFrom!: any;


	@ForeignKey(() => Sector)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	sectorId!: number;


	@AllowNull(false)
	@Column(DataType.STRING)
	yearsOfExp!: string;


	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	default!: any;


	@AllowNull(false)
	@ForeignKey(() => Profession)
	@Column(DataType.INTEGER)
	professionId!: number;




	@AllowNull(false)
	@ForeignKey(() => Profile)
	@Column(DataType.INTEGER)
	profileId!: number;


	@BelongsTo(() => Profile, { onDelete: 'CASCADE' })
	profile!: Profile;

	@BelongsTo(() => Sector, { onDelete: 'CASCADE' })
	sector!: Sector;



	@BelongsTo(() => Profession, { onDelete: 'CASCADE' })
	profession!: Profession;


	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;

}
