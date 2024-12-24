import { HttpStatus, Injectable } from "@nestjs/common";
import { create } from "domain";
import { DatasourceService } from "src/datasource/datasource.service";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Algoritm } from "./algoritm.entity";
import { CreateAlgoritmDto } from "./dto/create-algoritm.dto";

@Injectable() 
export class AlgoritmServace {
    constructor(
        @InjectRepository(Algoritm)
        private readonly algoritmRepository: Repository<Algoritm>, 
    ){}
    
    async create(algoritmrDto: CreateAlgoritmDto): Promise<Algoritm>
    {
       const algoritm = this.algoritmRepository.create();
       algoritm.id = algoritmrDto.id; 
       algoritm.count = algoritmrDto.count;
       algoritm.istok = algoritmrDto.istok;
       algoritm.stok = algoritmrDto.stok;
       algoritm.vershin = algoritmrDto.vershin;
       await this.algoritmRepository.save(algoritm); 
       return algoritm;
     }

     findOne(id: number): Promise<Algoritm> {
        return this.algoritmRepository.findOne({
          where: { id }
        });
      }
    
    async findAll(): Promise<Algoritm[]> {
        const algoritm = await this.algoritmRepository.find({}); 
        return algoritm;
      }

      async update(id: number, updatedAlgoritm: Algoritm) {
        const algoritm = await this.algoritmRepository.findOne({ where: { id } }); 
        algoritm.count = updatedAlgoritm.count;
        algoritm.istok = updatedAlgoritm.istok;
        algoritm.stok = updatedAlgoritm.stok;
        algoritm.vershin = updatedAlgoritm.vershin;
        await this.algoritmRepository.save(algoritm); 
        return algoritm; 
      }

      remove(id: number) {
        this.algoritmRepository.delete({ id }); 
      }
    
}