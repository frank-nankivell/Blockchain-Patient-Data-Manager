"""
A script to populate 100 health records - using example framework noted below
https://www.ahrq.gov/ncepcr/tools/pf-handbook/mod8-app-b-monica-latte.html
and additionally this dataset below
https://data.medicare.gov/views/bg9k-emty/files/82a69c75-b68f-49b1-b796-7473568a63be?filename=Hospital.pdf&content_type=application/octet-stream

"""

import pytz
import random
import datetime

from faker import Faker
from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from haikunator import Haikunator

bdb_root_url = 'http://localhost:9984'

country_list = ['United Kingdom', 'France', 'Belarus', 'Cambodia', 'Germany', 'United States', 'Chile', 'Thailand','China','Australia','Portugal','Spain','Sweden']
gender_list = ['Male','Female','Transgender','Polygender','Gender Neutral']
disease_list = ['Colorecetal_Cancer:_C17.0', 'Stomach_Cancer:_C16.0','Ovarian_Cancer:_C56.0','Skin_Cancer:_C43.0','Breast_Cancer:_C50.919', 'Chrohns_disease:_K50.0', 'Adenovirus:_B97.0', 'Systemic_barteonellosis:_A44.0']
birthDate_list = ['04/04/1950', '31/04/1956', '04/07/1999', '06/12/2003','01/12/1985','01/03/1972','31/03/1993']
response_list = ['Treatment provided','Medicine Distributed','Treatement Ongoing','Patient Deceased due to Illness','No response provided','Other']

num_patients = 3
patient_ID = 1


bdb = BigchainDB(bdb_root_url)

secure_random = random.SystemRandom()
haikunator = Haikunator()
fake = Faker()
now_unaware = datetime.datetime.utcnow()  # now_unaware.tzinfo is None
now = now_unaware.replace(tzinfo=pytz.UTC)  # now.tzinfo is UTC
posix_now = int(now.timestamp())  # = int(POSIX timestamp of now)

# External loop.
# Each iteration is for a different patient.

for patient_id in range(num_patients):
    print('Generating patient data for patientID_{}'.format(patient_ID))
    print('----------------------------------')
    if patient_ID == 1:
        ## sample set of date for first patient
        patient_name = 'Patient first v1',
        country = 'United Kingdom',
        birth_date = '04/04/1950',
        gender = 'Male',
        ssNumber = '00001',
        disease1 = 'Cellutis:_L03.90',
        response1 = 'Treatment Provided',
      ##  disease2 = 'Anemia: D64.9',
      ##  response2 = 'Awaiting treatment',
        clinician_Name = 'Bob Lockwood',

        
    else:
        
        patient_name = fake.name()
        birth_date = secure_random.choice(birthDate_list)
        gender = secure_random.choice(gender_list)
        ssNumber = random.randint(1, 3650) * 86400
        disease1 = secure_random.choice(disease_list)
        response1 = secure_random.choice(response_list)
      #  disease2 = secure_random.choice(disease_list)
      #  response2 = secure_random.choice(response_list)
        clinician_Name = haikunator.haikunate(token_length=0, delimiter=' ').title()

    # Make sure the datetime_created is in the UTC time zone.
    datetime_created = fake.date_time_between(start_date='-30y',
                                            end_date='-3y',
                                            tzinfo=pytz.UTC)
    patient_ID +=1
    healthUser = generate_keypair()


# We write the datetime_created as a POSIX timestamp
# converted to an integer
# = the number of seconds since 00:00:00 UTC on Jan. 1, 1970
# not counting leap seconds

    posix_datetime_created = int(datetime_created.timestamp())

    user_dict = {
        'data': {
            'Name': patient_name,
            'Country': country,
            'Patient_ID': patient_id,
            'Birth_date': birth_date,
            'Gender': gender,
            'Social_security_number': ssNumber,
            'Disease_1': disease1,
            'Response_1': response1,
         ## 'Disease_2': disease2, removing second disease for complexity
        ##  'Response_2': response2, removing second response for complexity
            'datetime_created': posix_datetime_created,
            'Clinician_name': clinician_Name,
        }
    }
    print('CREATE tx asset: {}'.format(user_dict))
    #print('public key is',healthUser.public_key)
    #print('prviate key is',healthUser.private_key)
    create_tx_metadata = {
        'notes': 'The CREATE transaction for one particular patient (an asset).'
    }
    print('CREATE tx metadata: {}'.format(create_tx_metadata))
    # Prepare the CREATE transaction.
    # Note that the creator (Sergio) is also the initial owner.
    prepared_create_tx = bdb.transactions.prepare(
        operation='CREATE',
        signers=healthUser.public_key,
        asset=user_dict,
        metadata=create_tx_metadata
    )
    print('\ncreate_tx is',prepared_create_tx)

    print('\nprivate key',healthUser.private_key)

    print('\npublic key',healthUser.public_key)


    fulfilled_create_tx = bdb.transactions.fulfill(
        prepared_create_tx,
        private_keys=healthUser.private_key
    )
    sent_create_tx = bdb.transactions.send_commit(fulfilled_create_tx)
    print('CREATE transaction id: {}'.format(fulfilled_create_tx))

    print('We are done generating all that Patient.')

print('We are done generating all fake data.')
