-- 1. Tabela Categorias
CREATE TABLE IF NOT EXISTS pasto (
    pastoid BIGSERIAL CONSTRAINT pk_pasto PRIMARY KEY,
    descricao VARCHAR(60),
    areatotal NUMERIC(10,2),
    ativo BOOLEAN,
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS piquete (
    piqueteid BIGSERIAL CONSTRAINT pk_piquete PRIMARY KEY,
    descricao VARCHAR(100),
    latitude NUMERIC(10,2),
    longitude NUMERIC(10,2),    
    pastoid BIGINT CONSTRAINT fk_piquete_pasto REFERENCES pasto,
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS animal (
    animalid BIGSERIAL CONSTRAINT pk_animal PRIMARY KEY,
    nome VARCHAR(60),
    datanascimento DATE,    
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS alocado (
    alocadoid BIGSERIAL CONSTRAINT pk_alocado PRIMARY KEY,
    descricao VARCHAR(100),
    datainicio DATE,
    datafinal  DATE,
    animalid BIGINT CONSTRAINT fk_alocado_animal REFERENCES animal,
    piqueteid BIGINT CONSTRAINT fk_alocado_piquete REFERENCES piquete,
    deleted BOOLEAN DEFAULT false
);
-- 3. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid BIGSERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
    username VARCHAR(10) UNIQUE,
    password TEXT,
    deleted BOOLEAN DEFAULT false
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Correção: Informar a coluna (username) no ON CONFLICT
INSERT INTO usuarios (usuarioid, username, password, deleted) VALUES
(default, 'admin', crypt('admin', gen_salt('bf')), false), 
(default, 'qwe', crypt('qwe', gen_salt('bf')), false)
ON CONFLICT (username) DO NOTHING;