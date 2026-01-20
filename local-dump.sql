--
-- PostgreSQL database dump
--

\restrict 5pGPXxWREpYdeGFogvtKW0FQLIhApWjrF8RXGCQGWFeiUoo5zeeZB8VmC65Y2yi

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: fields_sport_enum; Type: TYPE; Schema: public; Owner: marwansalman
--

CREATE TYPE public.fields_sport_enum AS ENUM (
    'football',
    'volleyball',
    'basketball'
);


ALTER TYPE public.fields_sport_enum OWNER TO marwansalman;

--
-- Name: player_position_enum; Type: TYPE; Schema: public; Owner: marwansalman
--

CREATE TYPE public.player_position_enum AS ENUM (
    'goalkeeper',
    'center_back',
    'right_back',
    'left_back',
    'defensive_midfielder',
    'central_midfielder',
    'attacking_midfielder',
    'right_winger',
    'left_winger',
    'striker',
    'point_guard',
    'shooting_guard',
    'small_forward',
    'power_forward',
    'center',
    'setter',
    'outside_hitter',
    'opposite_hitter',
    'middle_blocker',
    'libero',
    'defensive_specialist',
    'Default'
);


ALTER TYPE public.player_position_enum OWNER TO marwansalman;

--
-- Name: tournaments_sport_enum; Type: TYPE; Schema: public; Owner: marwansalman
--

CREATE TYPE public.tournaments_sport_enum AS ENUM (
    'football',
    'volleyball',
    'basketball'
);


ALTER TYPE public.tournaments_sport_enum OWNER TO marwansalman;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: marwansalman
--

CREATE TYPE public.users_role_enum AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.users_role_enum OWNER TO marwansalman;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_logs; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.auth_logs (
    id integer NOT NULL,
    "userId" integer,
    "ipAddress" character varying,
    "userAgent" character varying,
    success boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.auth_logs OWNER TO marwansalman;

--
-- Name: auth_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: marwansalman
--

CREATE SEQUENCE public.auth_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_logs_id_seq OWNER TO marwansalman;

--
-- Name: auth_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marwansalman
--

ALTER SEQUENCE public.auth_logs_id_seq OWNED BY public.auth_logs.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date character varying NOT NULL,
    "startTime" character varying NOT NULL,
    "endTime" character varying NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "fieldId" uuid,
    "userId" integer
);


ALTER TABLE public.bookings OWNER TO marwansalman;

--
-- Name: fields; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.fields (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    sport public.fields_sport_enum DEFAULT 'football'::public.fields_sport_enum NOT NULL,
    address character varying NOT NULL,
    "pricePerHour" numeric(10,2) DEFAULT '25'::numeric,
    capacity integer,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.fields OWNER TO marwansalman;

--
-- Name: match; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.match (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    status character varying DEFAULT 'scheduled'::character varying NOT NULL,
    "scoreTeam1" integer,
    "scoreTeam2" integer,
    "tournamentId" uuid NOT NULL,
    "team1Id" uuid NOT NULL,
    "team2Id" uuid NOT NULL,
    "scheduledAt" timestamp with time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.match OWNER TO marwansalman;

--
-- Name: player; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.player (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "position" public.player_position_enum DEFAULT 'Default'::public.player_position_enum NOT NULL,
    "jerseyNumber" integer,
    "isCaptain" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "teamId" uuid
);


ALTER TABLE public.player OWNER TO marwansalman;

--
-- Name: team; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.team (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "tournamentId" uuid NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.team OWNER TO marwansalman;

--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.tournaments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    sport public.tournaments_sport_enum DEFAULT 'football'::public.tournaments_sport_enum NOT NULL,
    "maxTeams" integer DEFAULT 16 NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    status character varying DEFAULT 'registration'::character varying NOT NULL,
    "currentTeams" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "creatorId" integer
);


ALTER TABLE public.tournaments OWNER TO marwansalman;

--
-- Name: users; Type: TABLE; Schema: public; Owner: marwansalman
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying,
    password character varying NOT NULL,
    name character varying NOT NULL,
    surname character varying NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO marwansalman;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: marwansalman
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO marwansalman;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marwansalman
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: auth_logs id; Type: DEFAULT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.auth_logs ALTER COLUMN id SET DEFAULT nextval('public.auth_logs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: auth_logs; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.auth_logs (id, "userId", "ipAddress", "userAgent", success, "createdAt") FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.bookings (id, date, "startTime", "endTime", "totalPrice", "createdAt", "isActive", "fieldId", "userId") FROM stdin;
\.


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.fields (id, name, sport, address, "pricePerHour", capacity, "isActive") FROM stdin;
\.


--
-- Data for Name: match; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.match (id, round, status, "scoreTeam1", "scoreTeam2", "tournamentId", "team1Id", "team2Id", "scheduledAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.player (id, name, "position", "jerseyNumber", "isCaptain", "isActive", "createdAt", "teamId") FROM stdin;
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.team (id, name, "tournamentId", "isActive", "createdAt") FROM stdin;
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.tournaments (id, name, sport, "maxTeams", "startDate", "endDate", status, "currentTeams", "createdAt", "updatedAt", "isActive", "creatorId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: marwansalman
--

COPY public.users (id, username, email, password, name, surname, role, "createdAt", "updatedAt", "isActive") FROM stdin;
\.


--
-- Name: auth_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marwansalman
--

SELECT pg_catalog.setval('public.auth_logs_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marwansalman
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: player PK_65edadc946a7faf4b638d5e8885; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY (id);


--
-- Name: tournaments PK_6d5d129da7a80cf99e8ad4833a9; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY (id);


--
-- Name: match PK_92b6c3a6631dd5b24a67c69f69d; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: bookings PK_bee6805982cc1e248e94ce94957; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY (id);


--
-- Name: fields PK_ee7a215c6cd77a59e2cb3b59d41; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT "PK_ee7a215c6cd77a59e2cb3b59d41" PRIMARY KEY (id);


--
-- Name: auth_logs PK_f4ee581a4a56f10b64ffbfc1779; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "PK_f4ee581a4a56f10b64ffbfc1779" PRIMARY KEY (id);


--
-- Name: team PK_f57d8293406df4af348402e4b74; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: IDX_712fd1134fa6faf74e09b0bd75; Type: INDEX; Schema: public; Owner: marwansalman
--

CREATE INDEX "IDX_712fd1134fa6faf74e09b0bd75" ON public.fields USING btree (name);


--
-- Name: IDX_b63b048f5871d7f48cdb4d4de1; Type: INDEX; Schema: public; Owner: marwansalman
--

CREATE INDEX "IDX_b63b048f5871d7f48cdb4d4de1" ON public.tournaments USING btree (name);


--
-- Name: IDX_fe0bb3f6520ee0469504521e71; Type: INDEX; Schema: public; Owner: marwansalman
--

CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON public.users USING btree (username);


--
-- Name: match FK_35deee50e58a815bec24d4876ef; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_35deee50e58a815bec24d4876ef" FOREIGN KEY ("team1Id") REFERENCES public.team(id);


--
-- Name: bookings FK_38a69a58a323647f2e75eb994de; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: auth_logs FK_564498ad3b1e8e338de48222381; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "FK_564498ad3b1e8e338de48222381" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: tournaments FK_666047fec6c9a27e76bda4c711a; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT "FK_666047fec6c9a27e76bda4c711a" FOREIGN KEY ("creatorId") REFERENCES public.users(id);


--
-- Name: team FK_6c381b833f42438bdf2206f47bd; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "FK_6c381b833f42438bdf2206f47bd" FOREIGN KEY ("tournamentId") REFERENCES public.tournaments(id);


--
-- Name: bookings FK_8814b570b6bd4e3a68b8a16fee5; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK_8814b570b6bd4e3a68b8a16fee5" FOREIGN KEY ("fieldId") REFERENCES public.fields(id) ON DELETE CASCADE;


--
-- Name: match FK_b096f0c0ca94610b3e77128500c; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_b096f0c0ca94610b3e77128500c" FOREIGN KEY ("tournamentId") REFERENCES public.tournaments(id);


--
-- Name: match FK_b74ce0e545c690e8f690f761115; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_b74ce0e545c690e8f690f761115" FOREIGN KEY ("team2Id") REFERENCES public.team(id);


--
-- Name: player FK_e85150e7e8a80bee7f2be3adab0; Type: FK CONSTRAINT; Schema: public; Owner: marwansalman
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0" FOREIGN KEY ("teamId") REFERENCES public.team(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 5pGPXxWREpYdeGFogvtKW0FQLIhApWjrF8RXGCQGWFeiUoo5zeeZB8VmC65Y2yi

