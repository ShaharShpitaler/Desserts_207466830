use web;

##create tables 

CREATE TABLE IF NOT EXISTS users (
    email varchar(255) primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    user_name varchar(255) not null,
    gender ENUM('Male', 'Female', 'Other') not null,
    birth_date date not null,
    password varchar(255) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into users values('sapir@gmail.com', 'Sapir', 'Lulvi', 'sapirL', 'Female', '1994-08-06', 'Sa123456');

select * from users;



    
CREATE TABLE IF NOT EXISTS recipes (dessert_id int AUTO_INCREMENT primary key, dessert_name varchar(255) not null, user_email varchar(255) not null, dessert_description text null, total_time int not null, difficulty_level ENUM('Easy', 'Medium', 'Hard', 'Expert') not null, ingrediants text not null, how_to_prepare text not null, type_of_dessert ENUM('Cake', 'Cookie', 'Confectionery', 'Doughnuts', 'Frozen', 'Ice cream', 'Pastry', 'Pie', 'Pudding', 'Custer') not null, img_path varchar(255) null, 
constraint fk_username foreign key (user_email) references users(email)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into recipes(dessert_name, user_email, dessert_description, total_time, difficulty_level, ingrediants, how_to_prepare, type_of_dessert) values ('Macarons', 'sapir@gmail.com', 'sometimes you need to change it up with something a little fancier: enter macarons. They may seem intimidating but with our easy-to-follow guide, they don’t have to be', 80, 'Easy', 'powdered sugar - 1 Cups\nalmond flour 1 Cup\nsalt 1 teaspoon\nEgg whites 3\ngranulated sugar 0.5 cup\nvanilla extract 0.5 teaspoon\nMilk 1 cup\npink gel food coloring 2 drops','1.Make the macarons: In the bowl of a food processor, combine the powdered sugar, almond flour, and ½ teaspoon of salt, and process on low speed, until extra fine.\n2.Sift the almond flour mixture through a fine-mesh sieve into a large bowl In a separate large bowl, beat the egg whites and the remaining ½ teaspoon of salt with an electric hand mixer until soft peaks form. Gradually add the granulated sugar until fully incorporated. Continue to beat until stiff peaks form (you should be able to turn the bowl upside down without anything falling out).\n3. Add the vanilla and beat until incorporated. Add the food coloring and beat until just combined.', 'Cookie');
