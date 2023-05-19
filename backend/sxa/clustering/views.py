from django.shortcuts import get_object_or_404
import json
import pandas as pd
import numpy as np
import codecs
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ast import increment_lineno
from sklearn.cluster import KMeans

from sxa.settings import BASE_DIR

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

def reverse_category_name(conv_dic, col_name, category_name):
	reversed_name = ''
	for k, v in conv_dic[col_name].items():
		if v == category_name:
			reversed_name = k
	return reversed_name

# Create your views here.
class Clustering(APIView):

	def post(self,request,format=None):
		print("post recieved...")
		num_column_names = ['age','kei_kikan','taino_count','taino_month','bill_change_count','entry_age','sales_1','sales_2',]
		str_column_names=['sex','kaku_type_code','phone_career','phone_name','region_code','plan_id','plan_category','installment_count','campaign_code','campaign_code_2','campaign_code_3','campaign_code_4','channel','selling_method_code','pay_way_code',]
		# CSVファイル読み込み
		req_body=request.FILES.get('File')
		if req_body == None:
			return Response('request is None.', status=status.HTTP_400_BAD_REQUEST)
		else:
			with codecs.open(req_body.temporary_file_path(),"r","Shift-JIS", "ignore") as file:
				df = pd.read_csv(file, delimiter=',')
		# 不要な列の削除
		df=df.dropna(how='all').dropna(how='all',axis=1)
		df=df.fillna(0)
		df=df.drop('id',axis=1)
		# print(df)
		# 文字列データを一時的に数値に置換
		conv_dic = {}
		for col in str_column_names:
			conv_count = 0
			conv_values={}
			for category_name in list(df.groupby(col).groups.keys()):
				conv_values[category_name] = '{0:0>3}'.format(conv_count)
				conv_count += 1
			conv_dic[col] = conv_values
		df = df.replace(conv_dic)
		# クエリパラメータからクラスタ数を取得、セットされていない場合はデフォルトで6
		print('n_clusters: ',request.POST.get('n_clusters',6))
		model = KMeans(
			algorithm='auto', copy_x=True, init='k-means++', max_iter=300,
			n_clusters=int(request.POST.get('n_clusters',6)),n_init=10, n_jobs=1,
			precompute_distances='auto', random_state=0, tol=0.0001, verbose=0)
		print('自前')
		print(model)
		result=model.fit_predict(df)
		cluster = 'cluster'
		df[cluster] = result.tolist()
		
		# 全体件数
		total_count = len(df)
		# 商品1合計金額
		total_sales1_amount = df[['sales_1']].sum().values[0]
		# 商品2合計金額
		total_sales2_amount = df[['sales_2']].sum().values[0]
		# 数値カラム別平均
		num_cols_mean = df[num_column_names].mean().to_dict()
		# 文字列カラム項目別カウント
		str_cols_count = {}
		for col in str_column_names:
			str_cols_count[col] = df[[col]].groupby(col).size().to_dict()
		res_data=[]
		# クラスタ別集計
		for no, group in df.groupby('cluster'):
			whole_info={
				'count': len(group),
				'count_share': float('{0:.4f}'.format(len(group) / total_count * 100)),
				'sales1_amount': group[['sales_1']].sum().values[0],
				'sales1_share': float('{0:.4f}'.format(group[['sales_1']].sum().values[0] / total_sales1_amount * 100)),
				'sales2_amount': group[['sales_2']].sum().values[0],
				'sales2_share': float('{0:.4f}'.format(group[['sales_2']].sum().values[0] / total_sales2_amount * 100)),
			}
			columns=[]
			for column_name in group.keys():
				if column_name in str_column_names:
					categories=[]
					size_values = group[[column_name]].groupby(column_name).size().to_dict()
					# print(f'clusterNo.{no}, column: {column_name}, cluster length: {len(group)}')
					for category_name, category_size in size_values.items():
						category_total=str_cols_count[column_name][category_name]
						# print(f'{category_name}: {category_size}: {category_total}')
						category_ratio = category_size / len(group)
						category_whole_ratio = category_total / total_count
						categories.append({
							'category_name': reverse_category_name(conv_dic, column_name, category_name),
							'value': float('{0:.4f}'.format(category_ratio * 100)),
							'difference': float('{0:.4f}'.format((category_ratio - category_whole_ratio) / category_whole_ratio * 100))
						})
					columns.append({
						'column_name':column_name,
						'categories': categories,
						})
				elif column_name in num_column_names:
					categories = []
					mean_value = group[[column_name]].mean().values[0]
					whole_mean =num_cols_mean[column_name]
					categories.append({
						'category_name': 'average',
						'value': float('{0:.4f}'.format(mean_value)),
						'difference': float('{0:.4f}'.format((mean_value - whole_mean) / whole_mean * 100)),
					})
					columns.append({
						'column_name':column_name,
						'categories': categories,
					})

			res_data.append({
				'cluster_no': no+1,
				'whole_info': whole_info,
				'columns':columns,
			})
		with open('response.json', 'w') as f:
			json.dump(res_data, f,cls = MyEncoder)
		return Response(json.dumps(res_data, cls=MyEncoder))