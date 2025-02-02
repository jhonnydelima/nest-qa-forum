import { UniqueIdEntity } from './unique-id-entity'

export abstract class Entity<TProps> {
  private _id: UniqueIdEntity
  protected props: TProps

  get id() {
    return this._id
  }

  protected constructor(props: TProps, id?: string) {
    this.props = props
    this._id = new UniqueIdEntity(id)
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }
    if (entity.id === this._id) {
      return true
    }
    return false
  }
}
