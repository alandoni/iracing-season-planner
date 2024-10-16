import { Checkbox } from "frontend/components/atoms/checkbox"
import { Row } from "frontend/components/atoms/row"
import { Text } from "frontend/components/atoms/text"
import "./checkable_list.css"

interface CheckableListProps<T extends { id: number; name: string }> {
  title: string
  list: T[] | undefined
  checkedList: T[] | undefined
  onCheck: (checked: boolean, item: T) => void
}

export function CheckableList<T extends { id: number; name: string }>({
  title,
  list,
  checkedList,
  onCheck,
}: CheckableListProps<T>) {
  return (
    <div className="checkable-list">
      <Text>{title}</Text>
      <ul>
        {list?.map((item) => {
          return (
            <Row className="checkable-list-row" key={item.id}>
              <Checkbox
                small
                isChecked={checkedList?.find((c) => c.id === item.id) !== undefined}
                onChange={(checked) => onCheck(checked, item)}
              />
              <Text size="small">{item.name}</Text>
            </Row>
          )
        })}
      </ul>
    </div>
  )
}
