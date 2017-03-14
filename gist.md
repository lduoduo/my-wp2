# Aggregate pv / uv / sv / usv `for everyday`
+ pv: page views
+ uv: user views(distinct by ip)
+ sv: submit views(total count of submitflag)
+ usv: user submit views(how many users has submit form)

all those above distinct by channel and page

data:
```
{
    "channel" : "A",
    "page" : "pageA",
    "ip" : "192.168.10.1"
    "createOn" : ISODate("2017-02-24T16:42:37.992+08:00"),
    "submitflag" : NumberInt("0")
}
```

## Aggregate
```
db.data.aggregate([
    {
        $match: para
    },
    {
        $project: {
            //时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
            day: { $substr: [{ "$add": ["$createOn", 28800000] }, 0, 10] },
            //指定出现在输出的文档
            channel: 1,
            page: 1,
            ip: 1,
            submitflag: 1
        },
    },
    {
        $group: {
            //将_id设置为day数据
            _id: {
                day: "$day",
                channel: "$channel",
                page: "$page",
                ip: "$ip",
                submitflag: "$submitflag"
            },
            pv: { $sum: 1 },
            sv: { $sum: "$submitflag" }
        },
    }, {
        $group: {
            _id: {
                day: "$_id.day",
                channel: "$_id.channel",
                page: "$_id.page",
                ip: "$_id.ip",
            },
            pv: {
                $sum: "$pv"
            },
            sv: {
                $sum: "$sv"
            },
            usv: {
                $sum: "$_id.submitflag"
            }
        }
    }, {
        $group: {
            _id: {
                day: "$_id.day",
                channel: "$_id.channel",
                page: "$_id.page"
            },
            pv: {
                $sum: "$pv"
            },
            sv: {
                $sum: "$sv"
            },
            uv: {
                $sum: 1
            },
            usv: {
                $sum: "$usv"
            }
        }
    },
    {
        $sort: { "_id.page": 1 }
    },
    {
        $skip: (page - 1) * countLimit
    },
    {
        $limit: countLimit
    }
]);
```

## original data

date |	channel | page | ip | submitflag
---|---|---|---|---|---
2017/03/14 12:06|B|B1|10.101.42.88|0
2017/03/14 12:06|A|A2|10.101.42.14|1
2017/03/14 12:06|B|B1|10.101.42.88|1
2017/03/14 12:06|A|A1|10.101.40.42|1
2017/03/14 12:06|A|A1|10.101.40.42|1
2017/03/14 12:06|B|B3|10.101.42.14|0
2017/03/14 12:06|B|B2|10.101.42.42|1
2017/03/14 12:06|A|A1|10.101.42.88|0

## expected result

date |	channel | page | pv | uv | sv | usv
---|---|---|---|---|---|---
2017/03/14|A|A1|3|2|2|1
2017/03/14|A|A2|1|1|1|1
2017/03/14|B|B1|2|1|1|1
2017/03/14|B|B2|1|1|1|1
2017/03/14|B|B3|1|1|0|0

## explain:
+ first $group:
    > get total count of pv / sv distinct by ip & submitflag

    - result:

    date |	channel | page | ip | submitflag | pv | uv | sv | usv
    ---|---|---|---|---|---|---|---|---
    2017/03/14|A|A1|10.101.42.88|0|1|--|0|--|--
    2017/03/14|A|A1|10.101.40.42|1|2|--|2|--|--
    2017/03/14|A|A2|10.101.42.14|1|1|--|1|--|--
    2017/03/14|B|B1|10.101.42.88|1|1|--|1|--|--
    2017/03/14|B|B1|10.101.42.88|0|1|--|0|--|--
    2017/03/14|B|B2|10.101.42.42|1|1|--|1|--|--
    2017/03/14|B|B3|10.101.42.14|0|1|--|0|--|--

+ second $group:
    > aggregate by submitflag per ip

    - result:

    date |	channel | page | ip | pv | uv | sv | usv
    ---|---|---|---|---|---|---|---
    2017/03/14|A|A1|10.101.40.42|2|--|2|1
    2017/03/14|A|A1|10.101.42.88|1|--|0|0
    2017/03/14|A|A2|10.101.42.14|1|--|1|1
    2017/03/14|B|B1|10.101.42.88|2|--|1|1
    2017/03/14|B|B2|10.101.42.42|1|--|1|1
    2017/03/14|B|B3|10.101.42.14|1|--|0|0

+ third $group:
    > aggregate by ip

    - result:

    date |	channel | page | pv | uv | sv | usv
    ---|---|---|---|---|---|---
    2017/03/14|A|A1|3|2|2|1
    2017/03/14|A|A2|1|1|1|1
    2017/03/14|B|B1|2|1|1|1
    2017/03/14|B|B2|1|1|1|1
    2017/03/14|B|B3|1|1|0|0

## references:
[Aggregate page views distinct by IP](https://gist.github.com/bertrandmartel/333635227172ab732b8c6ff2f230f162#file-page_view_aggregate-md)