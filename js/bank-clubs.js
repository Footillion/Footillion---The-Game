/* Question bank part 1: clubs, leagues, competitions. See engine.js addQ() for the format.
   Tiers (in order): Sunday League 10 | Squad Player 30 | First Teamer 60 | World Class 85 | One in a Footillion 100 */

/* ===================== LEAGUE CLUBS ===================== */
addQ(1, "A club that has played in the Premier League", [
  "Manchester United|Man United|Man Utd; Manchester City|Man City; Liverpool; Arsenal; Chelsea; Tottenham Hotspur|Tottenham|Spurs",
  "Everton; Newcastle United|Newcastle|Newcastle Utd; Aston Villa|Villa; West Ham United|West Ham; Leicester City|Leicester; Leeds United|Leeds; Brighton & Hove Albion|Brighton; Crystal Palace|Palace; Southampton; Wolverhampton Wanderers|Wolves|Wolverhampton; Fulham; Brentford; Nottingham Forest|Forest",
  "Burnley; Bournemouth|AFC Bournemouth; West Bromwich Albion|West Brom|WBA; Sunderland; Stoke City|Stoke; Watford; Norwich City|Norwich; Sheffield United|Sheffield Utd; Middlesbrough|Boro; Swansea City|Swansea; Hull City|Hull; Cardiff City|Cardiff; Huddersfield Town|Huddersfield; Luton Town|Luton; Ipswich Town|Ipswich; Blackburn Rovers|Blackburn; Bolton Wanderers|Bolton; Wigan Athletic|Wigan; Birmingham City|Birmingham; Charlton Athletic|Charlton; Derby County|Derby",
  "Portsmouth|Pompey; Reading; Queens Park Rangers|QPR; Coventry City|Coventry; Wimbledon|Wimbledon FC; Sheffield Wednesday|Sheffield Wed",
  "Oldham Athletic|Oldham; Swindon Town|Swindon; Barnsley; Blackpool; Bradford City|Bradford"
]);

addQ(1, "A club that has played in La Liga", [
  "Real Madrid; Barcelona|Barca|FC Barcelona; Atletico Madrid|Atletico|Atleti",
  "Sevilla; Valencia; Villarreal; Real Sociedad|La Real; Athletic Bilbao|Athletic Club|Bilbao; Real Betis|Betis; Celta Vigo|Celta; Getafe",
  "Espanyol; Osasuna; Mallorca; Girona; Rayo Vallecano|Rayo; Alaves|Deportivo Alaves; Levante; Granada; Cadiz; Elche; Las Palmas; Real Valladolid|Valladolid",
  "Deportivo La Coruna|Deportivo|Depor; Malaga; Real Zaragoza|Zaragoza; Sporting Gijon|Gijon; Real Oviedo|Oviedo; Racing Santander|Racing; Almeria|UD Almeria; Eibar; Leganes; Tenerife; Real Murcia|Murcia; Numancia",
  "Hercules; Xerez; Recreativo Huelva|Recreativo; Albacete; Logrones|CD Logrones"
]);

addQ(1, "A club that has played in Serie A", [
  "Juventus|Juve; AC Milan|Milan; Inter Milan|Inter|Internazionale",
  "Roma|AS Roma; Napoli; Lazio; Atalanta; Fiorentina|Viola; Torino",
  "Sampdoria; Genoa; Bologna; Udinese; Parma; Sassuolo; Cagliari; Hellas Verona|Verona; Empoli; Lecce; Spezia; Salernitana",
  "Chievo|Chievo Verona; Palermo; Brescia; Perugia; Reggina; Bari; Siena; Livorno; Catania; Cremonese; Como; Venezia; Monza",
  "Ascoli; Piacenza; Treviso; Ancona; Modena"
]);

addQ(1, "A club that has played in the Bundesliga", [
  "Bayern Munich|Bayern|Bayern Munchen; Borussia Dortmund|Dortmund|BVB",
  "RB Leipzig|Leipzig; Bayer Leverkusen|Leverkusen; Schalke 04|Schalke; Borussia Monchengladbach|Gladbach|Monchengladbach; Eintracht Frankfurt|Frankfurt; Werder Bremen|Bremen; VfL Wolfsburg|Wolfsburg",
  "Hamburg|Hamburger SV|HSV; VfB Stuttgart|Stuttgart; Hoffenheim|TSG Hoffenheim; Freiburg|SC Freiburg; Mainz|Mainz 05; Hertha Berlin|Hertha BSC|Hertha; Union Berlin; Augsburg; Koln|FC Koln|Cologne; Hannover 96|Hannover; Bochum|VfL Bochum; Heidenheim",
  "Nurnberg|1. FC Nurnberg|Nuremberg; Kaiserslautern; Fortuna Dusseldorf|Dusseldorf; Paderborn; Greuther Furth|Furth; Darmstadt|Darmstadt 98; Arminia Bielefeld|Bielefeld; Braunschweig|Eintracht Braunschweig; Karlsruher SC|Karlsruhe; St Pauli|FC St Pauli; Holstein Kiel|Kiel",
  "Energie Cottbus|Cottbus; Hansa Rostock|Rostock; MSV Duisburg|Duisburg; Unterhaching|SpVgg Unterhaching; Dynamo Dresden|Dresden; Wattenscheid|Wattenscheid 09"
]);

addQ(1, "A club that has played in Ligue 1", [
  "Paris Saint-Germain|PSG|Paris SG",
  "Marseille|Olympique de Marseille|OM; Lyon|Olympique Lyonnais|OL; Monaco|AS Monaco; Lille|LOSC",
  "Nice|OGC Nice; Rennes|Stade Rennais; Lens|RC Lens; Bordeaux|Girondins de Bordeaux; Nantes; Saint-Etienne|St Etienne|ASSE; Montpellier; Strasbourg; Toulouse; Reims|Stade de Reims; Brest",
  "Auxerre; Metz; Lorient; Guingamp; Caen; Nancy; Sochaux; Bastia; Angers; Troyes; Dijon; Amiens; Clermont; Le Havre; Nimes",
  "Valenciennes; Le Mans; Sedan|CS Sedan; Ajaccio|AC Ajaccio; Evian|Evian Thonon Gaillard; Grenoble"
]);

addQ(2, "A club that has played in the Scottish top flight", [
  "Celtic; Rangers",
  "Aberdeen; Hearts|Heart of Midlothian; Hibernian|Hibs; Dundee United; Motherwell",
  "Kilmarnock; St Mirren; St Johnstone; Ross County; Livingston; Dundee; Partick Thistle",
  "Inverness Caledonian Thistle|Inverness|Inverness CT; Hamilton Academical|Hamilton; Falkirk; Dunfermline|Dunfermline Athletic",
  "Gretna; Airdrieonians|Airdrie; Raith Rovers|Raith; Clydebank; Greenock Morton|Morton"
]);

addQ(2, "A club from the Dutch Eredivisie or Portuguese Primeira Liga", [
  "Ajax; Benfica; Porto|FC Porto; Sporting CP|Sporting Lisbon|Sporting",
  "PSV Eindhoven|PSV; Feyenoord; AZ Alkmaar|AZ; FC Twente|Twente; Braga|Sporting Braga; Vitoria Guimaraes|Guimaraes",
  "Vitesse; Utrecht|FC Utrecht; Heerenveen|SC Heerenveen; Groningen|FC Groningen; Willem II; NEC Nijmegen|NEC; Boavista; Maritimo; Rio Ave; Famalicao",
  "Heracles Almelo|Heracles; Go Ahead Eagles; Sparta Rotterdam|Sparta; PEC Zwolle|Zwolle; NAC Breda|NAC; Fortuna Sittard; Belenenses; Estoril; Gil Vicente; Vitoria Setubal|Setubal; Pacos de Ferreira|Pacos",
  "De Graafschap; RKC Waalwijk|RKC; Excelsior; Academica Coimbra|Academica; Uniao de Leiria|Leiria; Farense; Salgueiros; Beira-Mar"
]);

addQ(3, "A club that has played in Major League Soccer", [
  "Inter Miami; LA Galaxy|Los Angeles Galaxy|Galaxy; Seattle Sounders|Sounders; New York Red Bulls|Red Bulls; Atlanta United",
  "Los Angeles FC|LAFC; Portland Timbers|Timbers; New York City FC|NYCFC; Orlando City; Toronto FC|Toronto; Columbus Crew|Columbus; DC United; Philadelphia Union|Philadelphia; Sporting Kansas City|Sporting KC|Kansas City; Houston Dynamo|Houston; FC Dallas|Dallas; Vancouver Whitecaps|Whitecaps; Chicago Fire|Chicago; New England Revolution|Revolution|New England",
  "Real Salt Lake|RSL; Colorado Rapids|Rapids; San Jose Earthquakes|Earthquakes; Montreal Impact|CF Montreal|Montreal; Minnesota United; Nashville SC|Nashville; Austin FC|Austin; FC Cincinnati|Cincinnati; Charlotte FC|Charlotte; St. Louis City|St Louis City; San Diego FC|San Diego",
  "Chivas USA; Miami Fusion; Tampa Bay Mutiny|Mutiny",
  "MetroStars|NY/NJ MetroStars; Kansas City Wizards|Wizards; San Jose Clash|Clash; Dallas Burn|Burn"
]);

addQ(2, "A club that has won the UEFA Champions League (or European Cup)", [
  "Real Madrid; Liverpool; AC Milan|Milan; Barcelona|Barca; Bayern Munich|Bayern",
  "Manchester United|Man United|Man Utd; Chelsea; Inter Milan|Inter; Juventus|Juve; Manchester City|Man City; Ajax; Paris Saint-Germain|PSG",
  "Benfica; Porto|FC Porto; Nottingham Forest|Forest; Aston Villa|Villa; Borussia Dortmund|Dortmund",
  "Celtic; Hamburg|Hamburger SV; PSV Eindhoven|PSV; Feyenoord; Marseille|Olympique de Marseille",
  "Red Star Belgrade|Red Star|Crvena Zvezda; Steaua Bucharest|Steaua|FCSB"
]);

addQ(2, "A club that has won the FA Cup", [
  "Arsenal; Manchester United|Man United|Man Utd; Chelsea; Liverpool; Tottenham Hotspur|Tottenham|Spurs; Manchester City|Man City",
  "Newcastle United|Newcastle; Everton; Aston Villa|Villa; West Ham United|West Ham; Blackburn Rovers|Blackburn; Wolverhampton Wanderers|Wolves; Leicester City|Leicester; Wigan Athletic|Wigan; Portsmouth|Pompey; West Bromwich Albion|West Brom; Crystal Palace|Palace",
  "Sunderland; Preston North End|Preston; Bolton Wanderers|Bolton; Burnley; Sheffield Wednesday; Derby County|Derby; Cardiff City|Cardiff; Southampton; Coventry City|Coventry; Ipswich Town|Ipswich; Leeds United|Leeds; Nottingham Forest|Forest; Wimbledon; Sheffield United",
  "Barnsley; Charlton Athletic|Charlton; Huddersfield Town|Huddersfield; Bury; Notts County; Bradford City; Blackpool; Old Etonians",
  "Blackburn Olympic; Wanderers|Wanderers FC; Royal Engineers; Old Carthusians; Oxford University; Clapham Rovers"
]);

addQ(2, "A club nickname (e.g. The Gunners)", [
  "The Gunners|Gunners; The Red Devils|Red Devils; The Reds|Reds; The Blues|Blues; Spurs; The Citizens|Citizens; Los Blancos|Blancos",
  "The Toffees|Toffees; The Magpies|Magpies|Toon; The Hammers|Hammers|Irons; The Foxes|Foxes; The Eagles|Eagles; The Seagulls|Seagulls; The Saints|Saints; Wolves; The Villans|Villans; The Cottagers|Cottagers; The Bees|Bees; La Vecchia Signora|Old Lady|The Old Lady; Rossoneri; Nerazzurri; Blaugrana; Die Roten",
  "The Cherries|Cherries; The Clarets|Clarets; The Black Cats|Black Cats; The Potters|Potters; The Hornets|Hornets; The Canaries|Canaries; The Owls|Owls; The Baggies|Baggies; The Hatters|Hatters; The Blades|Blades; The Rams|Rams; The Tykes|Tykes; The Bantams|Bantams; The Lions|Lions; The Addicks|Addicks; Boro; Cules; Colchoneros; Merengues; Les Parisiens|Parisiens; Die Borussen|Borussen",
  "The Tractor Boys|Tractor Boys; The Trotters|Trotters; The Latics|Latics; The Seasiders|Seasiders; The Terriers|Terriers; The Shrimpers|Shrimpers; The Gas|Gasheads; The Pilgrims|Pilgrims; The Gills|Gills; The Hoops|Hoops; The Posh|Posh; The Cobblers|Cobblers; The Glovers|Glovers; The Imps|Imps; The Mariners|Mariners; The Stags|Stags; Rojiblancos|Los Rojiblancos; Il Biscione|Biscione; La Viola; Giallorossi; Biancocelesti; The Bhoys|Bhoys; The Gers|Gers",
  "The Chairboys|Chairboys; The Railwaymen|Railwaymen; The Quakers|Quakers; The Spireites|Spireites; The Silkmen|Silkmen; The Iron|Iron; The Shakers|Shakers; The Minstermen|Minstermen; The Robins|Robins; The Valiants|Valiants; The Daggers|Daggers; The Pirates|Pirates; La Furia Roja|Furia Roja"
]);

addQ(3, "A football kit or boot manufacturer", [
  "Nike; Adidas; Puma",
  "Umbro; Kappa; New Balance; Under Armour; Joma; Macron; Hummel; Mizuno; Reebok; Lotto",
  "Diadora; Asics; Admiral; Le Coq Sportif; Errea; Castore; Uhlsport; Warrior; Fila; Patrick; Mitre; Canterbury",
  "Kelme; Pony; Gola; Bukta; Score Draw; Hi-Tec|Hi Tec; Penalty; Legea; Givova; Jako; Zeus; Craft; Select; Topper; Stanno",
  "Vandanel; Matchwinner; Capelli Sport|Capelli; Xara; Avec Sportswear|Avec"
]);

addQ(1, "A major football competition or trophy", [
  "FA Cup; Champions League|UEFA Champions League; World Cup|FIFA World Cup; Premier League; Europa League|UEFA Europa League; Euros|European Championship|UEFA European Championship|Euro",
  "League Cup|Carabao Cup|EFL Cup|Carling Cup; Copa America; Copa del Rey; Serie A; La Liga; Bundesliga; Ligue 1; Conference League|UEFA Conference League; Nations League|UEFA Nations League; Community Shield|FA Community Shield; Copa Libertadores|Libertadores; Club World Cup|FIFA Club World Cup",
  "Africa Cup of Nations|AFCON|African Cup of Nations; Asian Cup|AFC Asian Cup; Gold Cup|CONCACAF Gold Cup; Coppa Italia; DFB-Pokal|DFB Pokal|German Cup; Coupe de France|French Cup; Scottish Cup; Scottish Premiership; Championship|EFL Championship; Supercopa|Supercopa de Espana; Super Cup|UEFA Super Cup; Confederations Cup|FIFA Confederations Cup; Copa Sudamericana|Sudamericana; FA Trophy; EFL Trophy|Football League Trophy|Papa Johns Trophy",
  "Cup Winners' Cup|European Cup Winners' Cup|Cup Winners Cup; UEFA Cup; Intertoto Cup|UEFA Intertoto Cup|Intertoto; Inter-Cities Fairs Cup|Fairs Cup; Intercontinental Cup; Charity Shield; Full Members Cup; Anglo-Italian Cup; Texaco Cup; Zenith Data Systems Cup; Johnstone's Paint Trophy|Johnstones Paint Trophy; Supercoppa Italiana|Supercoppa; Trophee des Champions|French Super Cup; DFL-Supercup|German Super Cup",
  "Mitropa Cup; Watney Cup; Anglo-Scottish Cup; Simod Cup; Auto Windscreens Shield; Leyland DAF Cup; Copa Rio; Sir Thomas Lipton Trophy|Lipton Trophy; Football League Group Cup|Group Cup"
]);

addQ(1, "A position or role on a football pitch", [
  "Goalkeeper|Keeper|GK; Striker|Forward|Centre Forward|Center Forward; Defender; Midfielder; Winger; Centre Back|Center Back|Centre Half|CB; Full Back|Fullback|Right Back|Left Back",
  "Wing Back|Wingback; Sweeper; Playmaker; Holding Midfielder|Defensive Midfielder|CDM|Anchor Man|Anchor; Attacking Midfielder|CAM|Number 10|No 10|Number Ten; Centre Midfielder|Center Midfielder|Central Midfielder; Second Striker|Support Striker; Target Man; Poacher; Box-to-Box Midfielder|Box to Box",
  "Libero; False Nine|False 9; Regista; Mezzala; Trequartista; Inverted Winger|Inside Forward; Inverted Full Back|Inverted Fullback; Deep-Lying Playmaker|Deep Lying Playmaker|Deep Lying Forward; Ball-Playing Defender|Ball Playing Defender; Stopper; Enganche; Advanced Playmaker",
  "Volante; Carrilero; Metodista; Fantasista; Raumdeuter; Mediapunta; Pivote|Pivot; Interior; Lateral; Segundo Volante; Zaguero; Centrocampista",
  "Tornante; Rifinitore; Fluidificante; Mediano; Relayeur; Meneur de Jeu; Ala"
]);

addQ(1, "A skill, trick or move in football", [
  "Nutmeg; Rabona; Bicycle Kick|Overhead Kick|Scissor Kick; Step Over|Stepover; Header; Volley; Dribble; Chip|Lob",
  "Panenka; Cruyff Turn; Elastico|Flip Flap; Scorpion Kick; Backheel|Back Heel; Free Kick; Trivela; Knuckleball; Rainbow Flick|Rainbow; Maradona Turn|Marseille Turn|Roulette|Zidane Roulette; Sombrero Flick|Sombrero; Slide Tackle|Sliding Tackle; Long Throw; One-Two|Wall Pass|Give and Go",
  "Ronaldo Chop|Chop; Okocha Flick|Okocha; La Croqueta|Croqueta; Drag Back|Drag-Back; Berbatov Spin|Berba Spin; Heel Flick; Pele Dummy|Dummy; Cutback|Cut Back; Jink; Tunnel; Caneta; Bamba",
  "Akka 3000|Akka; Seal Dribble|Seal; Around the World|ATW; Lambretta; McGeady Spin|McGeady; Pedalada; Gambeta; Ginga",
  "Cuauhtemina|Blanco Hop|Cuauhtemoc Hop; Hocus Pocus"
]);

addQ(2, "A famous football stadium", [
  "Old Trafford; Camp Nou|Spotify Camp Nou; Santiago Bernabeu|Bernabeu; Anfield; Wembley|Wembley Stadium; Emirates Stadium|Emirates; Etihad Stadium|Etihad",
  "Stamford Bridge; San Siro|Giuseppe Meazza|Stadio Giuseppe Meazza; Allianz Arena; Signal Iduna Park|Westfalenstadion; Parc des Princes; Maracana; Wanda Metropolitano|Metropolitano|Civitas Metropolitano; Tottenham Hotspur Stadium|Spurs Stadium; London Stadium|Olympic Stadium; Goodison Park; St James' Park|St James Park; Villa Park; Celtic Park|Parkhead; Ibrox; Hampden Park|Hampden",
  "Estadio da Luz|Da Luz; Estadio do Dragao|Dragao; Johan Cruyff Arena|Amsterdam Arena|Johan Cruijff Arena; De Kuip|Stadion Feijenoord; Mestalla; Ramon Sanchez Pizjuan|Sanchez Pizjuan; San Mames; Reale Arena|Anoeta; Stade Velodrome|Velodrome; Groupama Stadium|Parc OL; Stade de France; Principality Stadium|Millennium Stadium; Craven Cottage; Selhurst Park; Molineux; Elland Road; Turf Moor; Carrow Road; Bramall Lane; King Power Stadium|King Power; Amex Stadium|Amex|Falmer Stadium; Hillsborough; Ewood Park; Portman Road; Stadio Olimpico|Olimpico; Allianz Stadium|Juventus Stadium|Allianz Stadium Turin; Azteca|Estadio Azteca; La Bombonera|Bombonera; Estadio Monumental|El Monumental",
  "Boleyn Ground|Upton Park; Highbury; White Hart Lane; Maine Road; Roker Park; Ayresome Park; Baseball Ground; Burnden Park; Highfield Road; The Dell|Dell; Filbert Street; Stadium of Light; Riverside Stadium|Riverside; The Hawthorns|Hawthorns; Bet365 Stadium|Britannia Stadium; DW Stadium|JJB Stadium; Reebok Stadium; Pride Park; Kenilworth Road; City Ground; Gtech Community Stadium|Brentford Community Stadium|Griffin Park; Vitality Stadium|Dean Court; St Mary's Stadium|St Marys|St Mary's; Liberty Stadium; Cardiff City Stadium; Loftus Road; Fratton Park; Deepdale; Ninian Park; Plough Lane; Vetch Field",
  "Estadio Centenario|Centenario; Luzhniki Stadium|Luzhniki; Stadio San Paolo|Diego Armando Maradona Stadium|San Paolo; Stadio delle Alpi|Delle Alpi; Estadio Vicente Calderon|Vicente Calderon; Stade Louis II|Louis II; Vicarage Road; Priestfield; Layer Road; Gay Meadow; Home Park; Spotland; Brisbane Road; Plainmoor; Victoria Ground; Valley Parade; Feethams; Ashton Gate; Bloomfield Road; Racecourse Ground|The Racecourse"
]);

addQ(3, "A club based in London", [
  "Arsenal; Chelsea; Tottenham Hotspur|Tottenham|Spurs; West Ham United|West Ham; Crystal Palace|Palace; Fulham",
  "Brentford; Queens Park Rangers|QPR; Millwall; Charlton Athletic|Charlton; Leyton Orient|Orient; AFC Wimbledon|Wimbledon",
  "Barnet; Sutton United|Sutton; Bromley; Dagenham & Redbridge|Dagenham; Welling United|Welling; Wealdstone; Hendon; Dulwich Hamlet|Dulwich; Tooting & Mitcham|Tooting; Cray Wanderers|Cray; Kingstonian; Enfield Town|Enfield; Harrow Borough|Harrow; Corinthian-Casuals|Corinthian Casuals|Casuals; Fisher; Erith & Belvedere|Erith; Hampton & Richmond|Hampton; Wingate & Finchley|Finchley; Hayes & Yeading|Hayes",
  "Clapton; Leyton; Thamesmead Town|Thamesmead; Hanwell Town|Hanwell; Metropolitan Police|Met Police; Ilford; Romford; Haringey Borough|Haringey; Carshalton Athletic|Carshalton; Uxbridge; Hillingdon Borough|Hillingdon; Beckenham Town|Beckenham; Lewisham Borough|Lewisham; Southall",
  "Cockfosters; Hackney Wick; Sporting Bengal; Rayners Lane|Rayners; Broadfields United|Broadfields; Peckham Town|Peckham"
]);
