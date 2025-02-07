import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-questions-repository copy'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let studentsRepository: InMemoryStudentsRepository
let hashGenerator: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    hashGenerator = new FakeHasher()
    sut = new RegisterStudentUseCase(studentsRepository, hashGenerator)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: '123456',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: '123456',
    })
    const hashedPassword = await hashGenerator.hash('123456')
    expect(result.isRight()).toBe(true)
    expect(studentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
