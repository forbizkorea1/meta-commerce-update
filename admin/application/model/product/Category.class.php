<?php

namespace CustomScm\Model\Product;

/**
 * 카테고리 모델
 *
 * @author hoksi
 */
class Category extends \CustomScm\Model\Category
{

    public function __construct()
    {
        parent::__construct();

        $this->categoryTbl = TBL_SHOP_CATEGORY_INFO;
    }

    /**
     * cid로 카테고리 정보 가지고 오기
     * @param $cids
     * @return array
     */
    public function getListByCid($cids = false)
    {
        if ($cids !== false) {
            $this->qb->whereIn('c.cid', $cids);
        }

        $rows = $this->qb
            ->select('cname')
            ->select('cid')
            ->select('depth')
            ->from($this->categoryTbl . ' AS c')
            ->where('is_delete', 0)
            ->orderBy('vlevel1', 'ASC')
            ->orderBy('vlevel2', 'ASC')
            ->orderBy('vlevel3', 'ASC')
            ->orderBy('vlevel4', 'ASC')
            ->orderBy('vlevel5', 'ASC')
            ->exec()->getResultArray();

        if (!empty($rows)) {
            foreach ($rows as $key => $val) {
                $pathData = $this->getCategoryPath($val['cid'], $val['depth']);
                $val['path'] = implode(" > ", array_column($pathData, 'cname'));
                $rows[$key] = $val;
            }
        }

        return $rows;
    }

    public function del($cid)
    {
        //릴레이션 테이블에 연결되어 있으면 삭제하지 않는다.
        $cnt = $this->qb
                ->from(TBL_SHOP_PRODUCT . ' AS p')
                ->join(TBL_SHOP_PRODUCT_RELATION . ' AS pr', 'ON p.id = pr.pid')
                ->where('cid', $cid)
                ->where('is_delete', '0')
                ->getCount() > 0;
        if ($cnt === false) {
            parent::del($cid);
            return 'success';
        } else {
            return 'fail';
        }
    }

    public function getCremaCategoryInfo($cid = '')
    {
        $this->qb->select('IF(c.depth = 0, 0,
                                    IFNULL('.$this->qb
                ->startSubQuery()
                ->select('cid')
                ->from($this->categoryTbl.' AS sub')
                ->where('sub.depth', 'IF(c.depth < 2, 0,(c.depth-1))', false)
                ->where('sub.cid LIKE CONCAT(SUBSTR(c.cid, 1, 3 * (c.depth)),"%")')
                ->where('sub.is_delete', 0)
                ->limit(1)
                ->endSubQuery()
            .', 0)
                                ) AS parent')
            ->select('IFNULL('.$this->qb
                    ->startSubQuery()
                    ->select('cid')
                    ->from($this->categoryTbl.' AS sub')
                    ->where('sub.depth', '(c.depth+1)', false)
                    ->where('sub.cid LIKE CONCAT(SUBSTR(c.cid, 1, 3 * (c.depth+ 1)),"%")')
                    ->where('sub.is_delete', 0)
                    ->limit(1)
                    ->endSubQuery()
                .', 0) AS children')
            ->select('cid')
            ->select('cname')
            ->select('category_code')
            ->select('category_use')
            ->select('depth')
            ->from($this->categoryTbl.' AS c');



        if ($cid != '') {
            return $this->qb->where('c.cid', $cid)
                ->limit(1)
                ->exec()
                ->getRowArray();
        } else {
            // 크리마 배치 일괄 등록시 삭제여부 확인.
            return $this->qb->where('c.is_delete', 0)
                ->exec()
                ->getResultArray();
        }
    }

    /**
     * 카테고리 수정
     * @param $data
     * @return array
     * @throws \Exception
     */
    public function put($cid, $data)
    {
        $this->qb
            ->set('cname', $data['cname'])
            ->set('category_code', $data['category_code'])
            ->set('category_use', $data['category_use'])
            ->set('disp_naver', $data['disp_naver'])
            ->set('disp_daum', $data['disp_daum'])
            ->set('regdate', date('Y-m-d H:i:s'))
            ->where('cid', $cid)
            ->update($this->categoryTbl)
            ->exec();

        return [
            'cid' => $data['cid']
            , 'cname' => $data['cname']
            , 'category_code' => $data['category_code'] ?? ''
            , 'category_use' => $data['category_use'] ?? ''
            , 'disp_naver' => $data['disp_naver'] ?? ''
            , 'disp_daum' => $data['disp_daum'] ?? ''
        ];
    }
}