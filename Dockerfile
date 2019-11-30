FROM python:3

ADD ./scriptLoad/healthdata_populate_csv.py /
ADD ./scriptLoad/requirements.txt /

RUN pip install --upgrade pip \
&& pip install -r requirements.txt

CMD [ "python3", "./scriptLoad/healthdata_populate_csv.py" ]