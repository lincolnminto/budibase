import { GenericContainer } from "testcontainers"
import postgres from "../../../../packages/server/src/integrations/postgres"

jest.unmock("pg")

describe("getExternalSchema", () => {
  describe("postgres", () => {
    let host: string
    let port: number
    let config: any

    beforeAll(async () => {
      const container = await new GenericContainer("postgres")
        .withExposedPorts(5432)
        .withEnv("POSTGRES_PASSWORD", "password")
        .start()

      host = container.getContainerIpAddress()
      port = container.getMappedPort(5432)

      config = {
        host,
        port,
        database: "postgres",
        user: "postgres",
        password: "password",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
      }
    })

    it("can export an empty database", async () => {
      const integration = new postgres.integration(config)
      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "--
        -- PostgreSQL database dump
        --

        -- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
        -- Dumped by pg_dump version 15.3

        SET statement_timeout = 0;
        SET lock_timeout = 0;
        SET idle_in_transaction_session_timeout = 0;
        SET client_encoding = 'UTF8';
        SET standard_conforming_strings = on;
        SELECT pg_catalog.set_config('search_path', '', false);
        SET check_function_bodies = false;
        SET xmloption = content;
        SET client_min_messages = warning;
        SET row_security = off;

        --
        -- PostgreSQL database dump complete
        --

        "
      `)
    })

    it("can export a database with tables", async () => {
      const integration = new postgres.integration(config)

      await integration.internalQuery({
        sql: `
      CREATE TABLE "users" (
      "id" SERIAL,
      "name" VARCHAR(100) NOT NULL,
      "role" VARCHAR(15) NOT NULL,
      PRIMARY KEY ("id")
    );
      CREATE TABLE "products" (
	    "id" SERIAL,
	    "name" VARCHAR(100) NOT NULL,
	    "price" DECIMAL NOT NULL,
	    PRIMARY KEY ("id")
    );`,
      })

      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "--
        -- PostgreSQL database dump
        --

        -- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
        -- Dumped by pg_dump version 15.3

        SET statement_timeout = 0;
        SET lock_timeout = 0;
        SET idle_in_transaction_session_timeout = 0;
        SET client_encoding = 'UTF8';
        SET standard_conforming_strings = on;
        SELECT pg_catalog.set_config('search_path', '', false);
        SET check_function_bodies = false;
        SET xmloption = content;
        SET client_min_messages = warning;
        SET row_security = off;

        SET default_tablespace = '';

        SET default_table_access_method = heap;

        --
        -- Name: products; Type: TABLE; Schema: public; Owner: postgres
        --

        CREATE TABLE public.products (
            id integer NOT NULL,
            name character varying(100) NOT NULL,
            price numeric NOT NULL
        );


        ALTER TABLE public.products OWNER TO postgres;

        --
        -- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --

        CREATE SEQUENCE public.products_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;


        ALTER TABLE public.products_id_seq OWNER TO postgres;

        --
        -- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --

        ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


        --
        -- Name: users; Type: TABLE; Schema: public; Owner: postgres
        --

        CREATE TABLE public.users (
            id integer NOT NULL,
            name character varying(100) NOT NULL,
            role character varying(15) NOT NULL
        );


        ALTER TABLE public.users OWNER TO postgres;

        --
        -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --

        CREATE SEQUENCE public.users_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;


        ALTER TABLE public.users_id_seq OWNER TO postgres;

        --
        -- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --

        ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


        --
        -- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


        --
        -- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


        --
        -- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.products
            ADD CONSTRAINT products_pkey PRIMARY KEY (id);


        --
        -- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.users
            ADD CONSTRAINT users_pkey PRIMARY KEY (id);


        --
        -- PostgreSQL database dump complete
        --

        "
      `)
    })

    it("does not export a data", async () => {
      const integration = new postgres.integration(config)

      await integration.internalQuery({
        sql: `INSERT INTO "users" ("name", "role") VALUES ('John Doe', 'Administrator');
        INSERT INTO "products" ("name", "price") VALUES ('Book', 7.68);`,
      })

      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "--
        -- PostgreSQL database dump
        --

        -- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
        -- Dumped by pg_dump version 15.3

        SET statement_timeout = 0;
        SET lock_timeout = 0;
        SET idle_in_transaction_session_timeout = 0;
        SET client_encoding = 'UTF8';
        SET standard_conforming_strings = on;
        SELECT pg_catalog.set_config('search_path', '', false);
        SET check_function_bodies = false;
        SET xmloption = content;
        SET client_min_messages = warning;
        SET row_security = off;

        SET default_tablespace = '';

        SET default_table_access_method = heap;

        --
        -- Name: products; Type: TABLE; Schema: public; Owner: postgres
        --

        CREATE TABLE public.products (
            id integer NOT NULL,
            name character varying(100) NOT NULL,
            price numeric NOT NULL
        );


        ALTER TABLE public.products OWNER TO postgres;

        --
        -- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --

        CREATE SEQUENCE public.products_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;


        ALTER TABLE public.products_id_seq OWNER TO postgres;

        --
        -- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --

        ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


        --
        -- Name: users; Type: TABLE; Schema: public; Owner: postgres
        --

        CREATE TABLE public.users (
            id integer NOT NULL,
            name character varying(100) NOT NULL,
            role character varying(15) NOT NULL
        );


        ALTER TABLE public.users OWNER TO postgres;

        --
        -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --

        CREATE SEQUENCE public.users_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;


        ALTER TABLE public.users_id_seq OWNER TO postgres;

        --
        -- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --

        ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


        --
        -- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


        --
        -- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


        --
        -- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.products
            ADD CONSTRAINT products_pkey PRIMARY KEY (id);


        --
        -- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --

        ALTER TABLE ONLY public.users
            ADD CONSTRAINT users_pkey PRIMARY KEY (id);


        --
        -- PostgreSQL database dump complete
        --

        "
      `)
    })
  })
})
