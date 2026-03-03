import json
data = json.load(open('药材数据导入.json', 'r', encoding='utf-8'))
print(f'总条数: {len(data)}')
print('有latin_name的:', len([x for x in data if x.get('latin_name')]))
print('latin_name为空的:', len([x for x in data if not x.get('latin_name')]))
for x in data:
    if not x.get('latin_name'):
        print(f"  无拉丁学名: {x.get('name')}")
