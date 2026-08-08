from locust import HttpUser, between, task
import random

class load_tester(HttpUser):
    wait_time = between(1,5)
    token = ""
    
    sample_codes = [
    "lCkE49", "JHJY81", "YNbs65", "fwTW60", "WEjd44", "MyfK49", "tMED49", "IXss49", "WwaU21", "iWVg85",
    "Exqy76", "tidk30", "tFWn09", "zKlS56", "zwjH75", "jebJ55", "qmjf47", "OpFY90", "diKF49", "dJse24",
    "OQyB15", "bwBg30", "oRNJ31", "jkXj38", "WzsI47", "BWlT20", "KhCb58", "CAbv80", "MPLU83", "QWLn97",
    "ymIq10", "nxxo71", "pkAr53", "pHIM86", "vDSh20", "OQLN69", "TKMn62", "oHBy80", "bvMg42", "pAxf14",
    "nejl18", "bzzr43", "KjzU32", "BXWT49", "CAbF37", "NCPL07", "xrUy69", "qbli08", "yJVF30", "oJKR09",
    "VGfQ88", "zdLy22", "zzbz95", "xsNK38", "AHOd90", "dOZp28", "NuSX67", "olaM21", "clbH01", "VuyC73",
    "VXCi77", "bCuy69", "ySgU51", "AYub86", "oDug01", "fEny93", "CSjL28", "HGUk38", "ZltV57", "IWvA50",
    "PkWi99", "Opwb09", "wmOM99", "pxso06", "KmZL47", "jlUD97", "HmvK41", "zQLe13", "tmWs69", "WyGB81",
    "VwvU99", "lLcW33", "mPLo48", "pYsZ44", "uwQk11", "Cxes72", "wKUA57", "TTww64", "HUaI86", "NQTB31",
    "haDK16", "Yxmx90", "lWYb93", "yIhE95", "HWtu11", "AjLU27", "FXaG02", "TQNk04", "MBub70", "llsr59"
    ]
    
    email_list = [
    "rebeccamooney@example.org", "oballard@example.net", "dunlaptodd@example.org", "illoyd@example.org",
    "marksfrank@example.net", "rachelcampbell@example.org", "barreradanielle@example.org", "adam70@example.com",
    "chrisedwards@example.com", "vdalton@example.org", "sullivandylan@example.net", "fcabrera@example.org",
    "shellygarcia@example.com", "ecarson@example.net", "benjaminrodriguez@example.net", "heatherdavis@example.com",
    "iwallace@example.org", "suttonchad@example.net", "rodriguezdaniel@example.com", "thorntonpatrick@example.org",
    "robert07@example.com", "changmelissa@example.org", "glenda55@example.net", "mendezjessica@example.com",
    "mathew97@example.com", "garnernathaniel@example.net", "kirkbrian@example.com", "tcarr@example.org",
    "tayala@example.net", "qarias@example.org", "angelagoodman@example.net", "justin56@example.com",
    "holmeschristine@example.com", "nashamber@example.com", "kwalton@example.net", "jenniferlester@example.com",
    "pricekristina@example.com", "ejones@example.org", "craigwendy@example.net", "gina46@example.org",
    "jparrish@example.net", "michael82@example.net", "becksarah@example.com", "davidramos@example.org",
    "tfisher@example.com", "brian56@example.org", "jason14@example.org", "santanachristina@example.net",
    "tony81@example.org", "stevenevans@example.org", "lisacastro@example.org", "amywilson@example.org",
    "andersontiffany@example.com", "njohnson@example.com", "melissa43@example.org", "allennicole@example.com",
    "bernardwilliam@example.net", "malikramsey@example.org", "kadams@example.org", "welchsteve@example.net",
    "brian65@example.org", "bethguerrero@example.org", "mhernandez@example.org", "fdecker@example.net",
    "jacquelinemcbride@example.net", "johnvincent@example.com", "heather98@example.net", "arielrogers@example.com",
    "parsonskimberly@example.org", "andrea36@example.org", "paul29@example.org", "ypatrick@example.com",
    "russell09@example.net", "williampugh@example.org", "tyler37@example.net", "whitejeffrey@example.org",
    "johnny57@example.net", "amber71@example.net", "bhernandez@example.com", "hannah51@example.org",
    "parkeramanda@example.org", "christopher07@example.com", "derek43@example.net", "yhall@example.org",
    "guzmanamber@example.net", "justinbentley@example.net", "hmurray@example.org", "whouston@example.net",
    "aaron69@example.com", "monicabrown@example.net", "smithjon@example.com", "pgentry@example.com",
    "brianna22@example.org", "victor72@example.com", "juan76@example.com", "thompsonronald@example.net",
    "iromero@example.org", "fstevens@example.com", "angela05@example.com", "melissabowen@example.net"
    ]
    
    email_list = [email for email in email_list if email != "user@example.com"] # because its password is different form other
    def on_start(self):
        mail = random.choice(self.email_list)
        response = self.client.post(
            "/login",
            data={
            "username": mail, 
            "password": "1234"
            }
        )
        
        if response.status_code == 200:
            self.token = response.json().get("access_token")
            
            
    @task(3)
    def create_short_url(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {"original_url": "https://www.google.com"}
        
        self.client.post("/urls/", json=payload, headers=headers)
        
    @task(1) 
    def get_all_urls(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        
        self.client.get("/urls/", headers=headers)
        
    @task(10)
    def test_redirect(self):
        code = random.choice(self.sample_codes)
        self.client.get(f"/urls/r/{code}", allow_redirects=False)