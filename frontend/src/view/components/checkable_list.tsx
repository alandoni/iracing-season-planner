import { Checkbox } from "./check_box"
import { Row } from "./row"
import { Text } from "./text"
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
            <Row key={item.id}>
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
