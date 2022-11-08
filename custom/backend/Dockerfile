FROM python:3.10
RUN mkdir /app
WORKDIR /app
ADD ./main.py /app/main.py
ADD ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple