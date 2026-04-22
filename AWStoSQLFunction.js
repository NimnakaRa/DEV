/**
* This lambda function is the trigger for table streams, which exports the data to rdbs.
* 
*/

const mysql = require('mysql');
const pool1 = mysql.createPool({
    connectionLimit: 200,
    host: "rideflag-analysis.cbqfbq0ijxnb.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Rideflag66!",
    database: "prod"
});

const pool2 = mysql.createPool({
    connectionLimit: 200,
    host: "rideflag-analysis.cbqfbq0ijxnb.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Rideflag66!",
    database: "dev"
});

async function runSql(sql, pool) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log("Mysql Connection Error");
            }
            connection.query(sql, (err, results) => {
                if (err) {
                    console.log("Query Error");
                    connection.release();
                    reject(err);
                }
                else {
                    console.log("Query finished successfuly");
                    connection.release();
                    resolve(results);
                }
            });
        });
    });
};

/*
function setRealScores(rider) {
    let res = { 'real_0': null, 'real_1': null, 'real_2': null, 'real_3': null, 'real_4': null };
    try {
        res.real_0 = Number(rider.real_scores.L[0].N);
    } catch (error) {
        res.real_0 = 'NULL';
    }
    try {
        res.real_1 = Number(rider.real_scores.L[1].N);
    } catch (error) {
        res.real_1 = 'NULL';
    }
    try {
        res.real_2 = Number(rider.real_scores.L[2].N);
    } catch (error) {
        res.real_2 = 'NULL';
    }
    try {
        res.real_3 = Number(rider.real_scores.L[3].N);
    } catch (error) {
        res.real_3 = 'NULL';
    }
    try {
        res.real_4 = Number(rider.real_scores.L[4].N);
    } catch (error) {
        res.real_4 = 'NULL';
    }
    return res;
}

function setLaplacianScores(rider) {
    let res = { 'laplacian_0': null, 'laplacian_1': null, 'laplacian_2': null, 'laplacian_3': null, 'laplacian_4': null };
    try {
        res.laplacian_0 = Number(rider.laplacian_scores.L[0].N);
    } catch (error) {
        res.laplacian_0 = 'NULL';
    }
    try {
        res.laplacian_1 = Number(rider.laplacian_scores.L[1].N);
    } catch (error) {
        res.laplacian_1 = 'NULL';
    }
    try {
        res.laplacian_2 = Number(rider.laplacian_scores.L[2].N);
    } catch (error) {
        res.laplacian_2 = 'NULL';
    }
    try {
        res.laplacian_3 = Number(rider.laplacian_scores.L[3].N);
    } catch (error) {
        res.laplacian_3 = 'NULL';
    }
    try {
        res.laplacian_4 = Number(rider.laplacian_scores.L[4].N);
    } catch (error) {
        res.laplacian_4 = 'NULL';
    }
    return res;
}
*/

//averager(array[], length.array[]) -> float
//This function takes in an array and a int which is the array length, returning the average
function averager(arr, int) {
    let average = 0;
    let total = 0;
    if (arr.length === 0) {
        //console.log("Array is empty!")
        return average
    }
    else {

        for (let index = 0; index < int; index++) {
            total += parseFloat(arr[index].N);
        }
        average = total / int;
        //console.log(average)
        return Number(average);
    }


}

//setVehicle(array1[],array2[]) -> vehicleObject
//This function takes two non-empty arrays created from the dynamoDB event and uses them to assign corresponding values
// to the var vehicle, the function then returns the vehicleObject
//The parameters Keys is an array of key value fields used by DynamoDB
//The parameter NewImage is an array containing all the new data that was added to DynamoDB
//Try and catch statements are used in case of missing fields, allowing an item to still be added to the SQLdb

function setVehicle(Keys, NewImage) {

    let vehicle = {
        'vehicle_id': null,
        'color': null,
        'license_plate': null,
        'make': null,
        'model': null,
        'transponder_id': null,
        'user_id': null,
        'vehicle_name': null
    };

    try {
        vehicle.vehicle_id = Keys.vehicle_id.S;
    } catch (error) {

        vehicle.vehicle_id = 'NULL';
    }
    try {
        vehicle.color = NewImage.color.S;
    } catch (error) {

        vehicle.color = 'NULL';
    }
    try {
        vehicle.license_plate = NewImage.license_plate.S;
    } catch (error) {

        vehicle.license_plate = 'NULL';
    }
    try {
        vehicle.make = NewImage.make.S;
    } catch (error) {

        vehicle.make = 'NULL';
    }
    try {
        vehicle.model = NewImage.model.S;
    } catch (error) {

        vehicle.model = 'NULL';
    }
    try {
        vehicle.transponder_id = NewImage.transponder_id.S;
    } catch (error) {

        vehicle.transponder_id = 'NULL';
    }
    try {
        vehicle.user_id = NewImage.user_id.S;
    } catch (error) {

        vehicle.user_id = 'NULL';
    }
    try {
        vehicle.vehicle_name = NewImage.vehicle_name.S;
    } catch (error) {

        vehicle.vehicle_name = 'NULL';
    }

    return vehicle;
}

//setUser(array1[],array2[]) -> userObject
//This function takes two non-empty arrays created from the dynamoDB event and uses them to assign corresponding values
// to the var user, the function then returns the userObject
function setUser(Keys, NewImage) {
    let user = {
        'user_id': null,
        'name': null,
        'email': null,
        'modified_on': null,
        'created_on': null,
        'total_owned_trips': null,
        'total_distance': null,
        'last_trip': null,
        'current_trip': null
    };

    try {
        user.user_id = Keys.user_id.S;
    } catch (error) {

        user.user_id = 'NULL';
    }
    try {
        user.name = NewImage.first_name.S;
    } catch (error) {

        user.name = 'NULL';
    }
    try {
        user.email = NewImage.email.S;
    } catch (error) {

        user.email = 'NULL';
    }
    try {
        user.modified_on = NewImage.modified_on.S;
    } catch (error) {

        user.modified_on = 'NULL';
    }
    try {
        user.created_on = NewImage.created_on.S;
    } catch (error) {

        user.created_on = 'NULL';
    }
    try {
        user.total_owned_trips = NewImage.total_owned_trips.S;
    } catch (error) {

        user.total_owned_trips = 'NULL';
    }
    try {
        user.total_distance = NewImage.total_distance_overall.N;
    } catch (error) {

        user.total_distance = 'NULL';
    }
    try {
        user.last_trip = NewImage.last_trip.S;
    } catch (error) {

        user.last_trip = 'NULL';
    }
    try {
        user.current_trip = NewImage.ongoing_trip.S;
    } catch (error) {

        user.current_trip = 'NULL';
    }

    return user;

}

//setTrip(array1[],array2[]) -> tripObject
//This function takes two non-empty arrays created from the dynamoDB event and uses them to assign corresponding values
// to the var trip, the function then returns the tripObject
function setTrips(Keys, NewImage) {
    let trip = {
        'trip_id': null,
        'start_time': null,
        'valid': null,
        'reward_granted': null,
        'vehicle_id': null,
        'end_time': null,
        'occupancy': null,
        'owner_id': null,
        'is_facecount': null,
        'driver_carpool_distance': null,
        'region': null,
        'passenger_carpool_distance': null,
        'transponder_id': null,
        'event_status': null,
        'total_driven_distance': null,
        'start_type': null
    };

    try {
        trip.trip_id = Keys.trip_id.S;
    } catch (error) {

        trip.trip_id = 'NULL';
    }
    try {
        trip.start_time = NewImage.start_time_from.S;
    } catch (error) {

        trip.start_time = 'NULL';
    }
    try {
        trip.valid = NewImage.is_valid['BOOL'];
    } catch (error) {

        trip.valid = 'NULL';
    }
    try {
        trip.reward_granted = NewImage.reward_granted['BOOL'];
    } catch (error) {

        trip.reward_granted = 'NULL';
    }
    try {
        trip.vehicle_id = NewImage.vehicle_plate.S;
    } catch (error) {

        trip.vehicle_id = 'NULL';
    }
    try {
        trip.end_time = NewImage.end_time.S;
    } catch (error) {

        trip.end_time = 'NULL';
    }
    try {
        trip.occupancy = NewImage.occupancy.N;
    } catch (error) {

        trip.occupancy = 'NULL';
    }
    try {
        trip.owner_id = NewImage.owner_id.S;
    } catch (error) {

        trip.owner_id = 'NULL';
    }
    try {
        trip.is_facecount = NewImage.facecount.S;
    } catch (error) {

        trip.is_facecount = 'NULL';
    }
    try {
        trip.driver_carpool_distance = NewImage.total_passenger_miles.N;
    } catch (error) {

        trip.driver_carpool_distance = 'NULL';
    }
    try {
        trip.region = NewImage.region.S;
    } catch (error) {

        trip.region = 'NULL';
    }
    try {
        trip.passenger_carpool_distance = NewImage.total_passenger_distance.N;
    } catch (error) {

        trip.passenger_carpool_distance = 'NULL';
    }
    try {
        trip.transponder_id = NewImage.transponder_id.S;
    } catch (error) {

        trip.transponder_id = 'NULL';
    }
    try {
        trip.event_status = NewImage.eventstatus.S;
    } catch (error) {

        trip.event_status = 'NULL';
    }
    try {
        trip.total_driven_distance = NewImage.distance.N;
    } catch (error) {

        trip.total_driven_distance = 'NULL';
    }
    try {
        trip.start_type = NewImage.start_type.S;
    } catch (error) {

        trip.start_type = 'NULL';
    }

    return trip;
}

//setOccupants(array1[],array2[],array3[], String) -> riderObject
//This function takes three non-empty arrays and a rider_id and uses them to assign corresponding values
// to the var occupant, the function then returns the riderObject
//The parameter RiderImage is an array contining all data for a given rider
//The parameter Rider is the rider_id corresponding to the RiderImage
function setOccupants(Keys, NewImage, RiderImage, Rider) {
    let occupant = {
        'trip_id': null,
        'rider_id': null,
        'average_real_score': null,
        'average_luminosity_score': null,
        'average_laplacian_score': null,
        'average_exit_real': null,
        'average_exit_luminosity': null,
        'average_exit_laplacian': null,
        'similarity_score': null

    };

    try {
        occupant.trip_id = Keys.trip_id.S;
    } catch (error) {

        occupant.trip_id = 'NULL';
    }
    try {
        occupant.rider_id = Rider;
    } catch (error) {

        occupant.rider_id = 'NULL';
    }
    try {
        occupant.average_real_score = averager(RiderImage.real_scores.L, RiderImage.real_scores.L.length);
    } catch (error) {

        occupant.average_real_score = 'NULL';
    }
    try {
        occupant.average_luminosity_score = averager(RiderImage.luminosity_scores.L, RiderImage.luminosity_scores.L.length);
    } catch (error) {

        occupant.average_luminosity_score = 'NULL';
    }
    try {
        occupant.average_laplacian_score = averager(RiderImage.laplacian_scores.L, RiderImage.laplacian_scores.L.length);
    } catch (error) {

        occupant.average_laplacian_score = 'NULL';
    }
    try {
        occupant.average_exit_real = averager(RiderImage.exit_real_scores.L, RiderImage.exit_real_scores.L.length);
    } catch (error) {

        occupant.average_exit_real = 'NULL';
    }
    try {
        occupant.average_exit_luminosity = averager(RiderImage.exit_luminosity_scores.L, RiderImage.exit_luminosity_scores.L.length);
    } catch (error) {

        occupant.average_exit_luminosity = 'NULL';
    }
    try {
        occupant.average_exit_laplacian = averager(RiderImage.exit_laplacian_scores.L, RiderImage.exit_laplacian_scores.L.length);
    } catch (error) {

        occupant.average_exit_laplacian = 'NULL';
    }
    try {
        occupant.similarity_score = RiderImage.signature_score.N;
    } catch (error) {

        occupant.similarity_score = 'NULL';
    }

    return occupant;
}

//setOccupantsScores(array1[], array2[], String) -> riderObject
//This function takes three non-empty arrays and a rider_id and uses them to assign corresponding values
// to the var occScores, the function then returns the riderObject
//The parameter Rider is the rider_id for a single rider
//The parameter capture_seq is the order in which elements appear in the array
function setOccupantScores(tripId, Rider, riderId, cap_seq) {
    let occScores = {
        'trip_id': null,
        'rider_id': null,
        'capture_sequence': null,
        'entry_masked': null,
        'entry_real': null,
        'entry_laplacian': null,
        'entry_luminosity': null,
        'exit_masked': null,
        'exit_real': null,
        'exit_laplacian': null,
        'exit_luminosity': null,
        'signature_match': null,
        'audit_val': null
    };
    console.log(tripId);
    //console.log(Rider);
    try {
        occScores.trip_id = tripId;
    } catch (error) {
        occScores.trip_id = 'NULL';
    }
    try {
        console.log("rider_id" + JSON.stringify(riderId));
        occScores.rider_id = riderId;
    } catch (error) {
        occScores.rider_id = 'NULL';
    }
    try {
        console.log("cap_seq" + JSON.stringify(cap_seq));
        occScores.capture_sequence = cap_seq;
    } catch (error) {
        occScores.capture_sequence = 'NULL';
    }
    try {
        console.log("Rider.masked['BOOL']" + JSON.stringify(Rider.masked['BOOL']));
        occScores.entry_masked = Rider.masked['BOOL'];
    } catch (error) {
        occScores.entry_masked = 'NULL';
    }
    try {
        console.log("entry_real_scores" + JSON.stringify(Rider.real_scores.L[cap_seq].N));
        occScores.entry_real = Rider.real_scores.L[cap_seq].N;
    } catch (error) {
        occScores.entry_real = 'NULL';
    }
    try {
        console.log("entry_laplacian_scores" + JSON.stringify(Rider.laplacian_scores.L[cap_seq].N));
        occScores.entry_laplacian = Rider.laplacian_scores.L[cap_seq].N;
    } catch (error) {
        occScores.entry_laplacian = 'NULL';
    }
    try {
        console.log("entry_luminosity_scores" + JSON.stringify(Rider.luminosity_scores.L[cap_seq].N));
        occScores.entry_luminosity = Rider.luminosity_scores.L[cap_seq].N;
    } catch (error) {
        occScores.entry_luminosity = 'NULL';
    }
    try {
        console.log("exit_masked" + JSON.stringify(Rider.exit_masked['BOOL']));
        occScores.exit_masked = Rider.exit_masked['BOOL'];
    } catch (error) {
        occScores.exit_masked = 'NULL';
    }
    try {
        console.log("exit_real_scores" + JSON.stringify(Rider.exit_real_scores.L[cap_seq].N));
        occScores.exit_real = Rider.exit_real_scores.L[cap_seq].N;
    } catch (error) {
        occScores.exit_real = 'NULL';
    }
    try {
        console.log("exit_laplacian_scores" + JSON.stringify(Rider.exit_laplacian_scores.L[cap_seq].N));
        occScores.exit_laplacian = Rider.exit_laplacian_scores.L[cap_seq].N;
    } catch (error) {
        occScores.exit_laplacian = 'NULL';
    }
    try {
        console.log("exit_luminosity_scores" + JSON.stringify(Rider.exit_luminosity_scores.L[cap_seq].N));
        occScores.exit_luminosity = Rider.exit_luminosity_scores.L[cap_seq].N;
    } catch (error) {
        occScores.exit_luminosity = 'NULL';
    }
    try {
        console.log("signature_match" + JSON.stringify(Rider.signature_score.N));
        occScores.signature_match = Rider.signature_score.N;
    } catch (error) {
        occScores.signature_match = 'NULL';
    }
    try {
        occScores.audit_val = Rider.audit_val.N;
    } catch (error) {
        occScores.audit_val = 'NULL';
    }

    return occScores;
}

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    var p = pool2;
    if (event.Records[0].eventSourceARN == 'arn:aws:dynamodb:us-east-1:333091463101:table/trip_details-prod/stream/2021-05-03T21:49:38.159') {
        p = pool1;
    }
    else if (event.Records[0].eventSourceARN == 'arn:aws:dynamodb:us-east-1:333091463101:table/Vehicle_table/stream/2022-06-20T18:05:35.832') {
        p = pool1;
    }
    else if (event.Records[0].eventSourceARN == 'arn:aws:dynamodb:us-east-1:333091463101:table/user_table/stream/2019-09-11T19:08:50.919') {
        p = pool1;
    }

    //Vehicle Piece
    let vehicleObject = setVehicle(event.Records[0].dynamodb.Keys, event.Records[0].dynamodb.NewImage);
    console.log(vehicleObject);

    console.log("checking if vehicle");
    if (vehicleObject.vehicle_id !== 'NULL') {
        console.log("vehicle confirmed");
        let sqlV = `INSERT INTO vehicle  (vehicle_id,  color,  license_plate,  make,  model,  transponder_id,  
						user_id,  vehicle_name)  VALUES 
						('${vehicleObject.vehicle_id}', '${vehicleObject.color}',
							'${vehicleObject.license_plate}', '${vehicleObject.make}', '${vehicleObject.model}',
							'${vehicleObject.transponder_id}', '${vehicleObject.user_id}', '${vehicleObject.vehicle_name}') 
							ON DUPLICATE KEY UPDATE
									vehicle_id = '${vehicleObject.vehicle_id}',
									color='${vehicleObject.color}', 
									license_plate = '${vehicleObject.license_plate}',
									make = '${vehicleObject.make}',
									model = '${vehicleObject.model}',
									transponder_id = '${vehicleObject.transponder_id}',
									user_id = '${vehicleObject.user_id}',
									vehicle_name = '${vehicleObject.vehicle_name}'`



        let resV = await runSql(sqlV, p);
        console.log(resV);
    }


    //User piece
    let userObject = setUser(event.Records[0].dynamodb.Keys, event.Records[0].dynamodb.NewImage);
    console.log(userObject);
    console.log("checking if user");
    if (userObject.user_id !== 'NULL') {
        console.log("user confirmed");
        let sqlU = `INSERT INTO users  (user_id,  name,  
						email,  modified_on,  created_on,  total_owned_trips,  
						total_distance,  last_trip, current_trip)  VALUES 
						('${userObject.user_id}', '${userObject.name}',
							'${userObject.email}', '${userObject.modified_on}', '${userObject.created_on}',
							'${userObject.total_owned_trips}', '${userObject.total_distance}', '${userObject.last_trip}', '${userObject.current_trip}') 
							ON DUPLICATE KEY UPDATE
									user_id = '${userObject.user_id}',
									name='${userObject.name}', 
									email = '${userObject.email}',
									modified_on = '${userObject.modified_on}',
									created_on = '${userObject.created_on}',
									total_owned_trips = '${userObject.total_owned_trips}',
									total_distance = '${userObject.total_distance}',
									last_trip = '${userObject.last_trip}',
									current_trip = '${userObject.current_trip}'`

        let resU = await runSql(sqlU, p);
        console.log(resU);
    }

    //Trip Piece
    let tripObject = setTrips(event.Records[0].dynamodb.Keys, event.Records[0].dynamodb.NewImage);
    console.log(tripObject);

    console.log("checking if trip");
    if (tripObject.trip_id !== 'NULL' && tripObject.start_time !== 'NULL') {
        console.log("trip confirmed");
        let sql = `INSERT INTO trips  (trip_start_time,  valid,  
							reward_granted,  occupancy,  owner_id,  trip_id,  end_time,  region,
							is_facecount, driver_carpool_distance,  vehicle_id,  transponder_id,  
							passenger_carpool_distance,  total_driven_distance,  event_status,  start_type)  VALUES 
							('${tripObject.start_time}', ${tripObject.valid},
								${tripObject.reward_granted}, ${tripObject.occupancy},
								'${tripObject.owner_id}', '${tripObject.trip_id}',
								'${tripObject.end_time}', '${tripObject.region}',
								'${tripObject.is_facecount}', '${tripObject.driver_carpool_distance}', '${tripObject.vehicle_id}',
								'${tripObject.transponder_id}', '${tripObject.passenger_carpool_distance}', '${tripObject.total_driven_distance}',
								'${tripObject.event_status}', '${tripObject.start_type}') 
								ON DUPLICATE KEY UPDATE
										trip_id = '${tripObject.trip_id}',
										trip_start_time='${tripObject.start_time}', 
										valid = ${tripObject.valid},
										reward_granted = ${tripObject.reward_granted},
										is_facecount = '${tripObject.is_facecount}',
										occupancy = ${tripObject.occupancy},
										driver_carpool_distance = '${tripObject.driver_carpool_distance}',
										owner_id = '${tripObject.owner_id}',
										end_time = '${tripObject.end_time}',
										vehicle_id = '${tripObject.vehicle_id}',
										region = '${tripObject.region}',
										transponder_id = '${tripObject.transponder_id}',
										passenger_carpool_distance = '${tripObject.passenger_carpool_distance}',
										total_driven_distance = ${tripObject.total_driven_distance},
										event_status = '${tripObject.event_status}',
										start_type = '${tripObject.start_type}'`
        let res3 = await runSql(sql, p);
        console.log(res3);


        //Occupant piece
        for (let riderIdO in event.Records[0].dynamodb.NewImage.rider_list.M) {
            let riderO = event.Records[0].dynamodb.NewImage.rider_list.M[riderIdO].M;
            let riderObjectO = setOccupants(event.Records[0].dynamodb.Keys, event.Records[0].dynamodb.NewImage, riderO, riderIdO);
            console.log(riderObjectO);

            console.log("checking for occupants");
            if (riderObjectO.average_real_score !== 'NULL') {
                let occupantSQL = `INSERT INTO occupants  (trip_id,  rider_id,  
				average_real_score, average_luminosity_score, average_laplacian_score,
				average_exit_real, average_exit_luminosity, average_exit_laplacian,
				similarity_score)  VALUES 
				('${riderObjectO.trip_id}', '${riderObjectO.rider_id}',
					${riderObjectO.average_real_score}, ${riderObjectO.average_luminosity_score}, ${riderObjectO.average_laplacian_score}, 
					${riderObjectO.average_exit_real}, ${riderObjectO.average_exit_luminosity}, ${riderObjectO.average_exit_laplacian},
					${riderObjectO.similarity_score}) 
					ON DUPLICATE KEY UPDATE
						trip_id= '${riderObjectO.trip_id}', 
						rider_id = '${riderObjectO.rider_id}',
						average_real_score = ${riderObjectO.average_real_score},
						average_luminosity_score =${riderObjectO.average_luminosity_score}, 
						average_laplacian_score =${riderObjectO.average_laplacian_score},
						average_exit_real =${riderObjectO.average_exit_real},
						average_exit_luminosity =${riderObjectO.average_exit_luminosity},
						average_exit_laplacian =${riderObjectO.average_exit_laplacian},
						similarity_score =${riderObjectO.similarity_score}`

                let res3 = await runSql(occupantSQL, p);
                console.log(res3);
                console.log("occupants confirmed");
            }

        }


        //Occupants_score piece
        //let capture_seq = 0;
        let cap_limit = 3;

        for (let riderId in event.Records[0].dynamodb.NewImage.rider_list.M) {
            let rider = event.Records[0].dynamodb.NewImage.rider_list.M[riderId].M;
            //let riderObject = setOccupantScores(event.Records[0].dynamodb.Keys.trip_id.S,rider, riderId,capture_seq);

            console.log("checking for occupants_scores");


            for (let cap_seq = 0; cap_seq < cap_limit; cap_seq++) {

                if (rider.entry_real !== 'NULL') {
                    let riderObject = setOccupantScores(event.Records[0].dynamodb.Keys.trip_id.S, rider, riderId, cap_seq)
                    console.log("aquiring occupants_scores");

                    let riderCapSeqSQL = `INSERT INTO occupant_scores  (trip_id,  rider_id,  
					capture_sequence,  entry_masked,  entry_real,  entry_laplacian, entry_luminosity,  
					exit_masked, exit_real, exit_laplacian, exit_luminosity, signature_match)  VALUES 
					('${riderObject.trip_id}', '${riderObject.rider_id}',
						${riderObject.capture_sequence}, ${riderObject.entry_masked}, ${riderObject.entry_real},
						${riderObject.entry_laplacian}, ${riderObject.entry_luminosity}, ${riderObject.exit_masked},
						${riderObject.exit_real}, ${riderObject.exit_laplacian}, ${riderObject.exit_luminosity},
						${riderObject.signature_match}) 
						ON DUPLICATE KEY UPDATE
								trip_id='${riderObject.trip_id}', 
								rider_id = '${riderObject.rider_id}',
								capture_sequence = ${riderObject.capture_sequence},
								entry_masked = ${riderObject.entry_masked},
								entry_real = ${riderObject.entry_real},
								entry_laplacian = ${riderObject.entry_laplacian},
								entry_luminosity = ${riderObject.entry_luminosity},
								exit_masked = ${riderObject.exit_masked},
								exit_real = ${riderObject.exit_real},
								exit_laplacian = ${riderObject.exit_laplacian},
								exit_luminosity = ${riderObject.exit_luminosity},
								signature_match = ${riderObject.signature_match}`

                    console.log("occupants scores confirmed")
                    let res4 = await runSql(riderCapSeqSQL, p);
                    console.log(res4);
                }





            }

        }
    }

    return null;
}
